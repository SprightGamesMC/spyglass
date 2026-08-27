import type { ArchiveFixture } from "../Types/ZipStorageReadsArchiveEntriesTypes.js";
import zlib from "node:zlib";
import ZipReader from "../../src/Storage/ZipReader.js";
import ZipStorage from "../../src/Storage/ZipStorage.js";
import ByteUtilities from "./Core/ByteUtilities.js";

export default abstract class ZipStorageReadsArchiveEntries {
    static readonly FIXTURES: readonly ArchiveFixture[] = [
        { files: { "BP/manifest.json": "{}", "BP/entities/a.json": '{"x":1}' }, deflate: true },
        { files: { "RP/manifest.json": "{}", "RP/textures/a.png": "png" }, deflate: false },
    ];

    static open(fixture: ArchiveFixture): ZipStorage {
        return new ZipStorage(ZipStorageReadsArchiveEntries.writeArchive(fixture.files, fixture.deflate));
    }

    static async readText(storage: ZipStorage, path: string): Promise<string> {
        return new TextDecoder().decode(await storage.readBytes(path));
    }

    static openInvalid(): ZipStorage | undefined {
        try {
            return new ZipStorage(new TextEncoder().encode("not a zip file at all"));
        } catch {
            return undefined;
        }
    }

    private static writeArchive(files: Readonly<Record<string, Uint8Array | string>>, deflate = true): Uint8Array {
        const locals: Uint8Array[] = [];
        const centrals: Uint8Array[] = [];
        let offset = 0;

        for (const [path, content] of Object.entries(files)) {
            const data = typeof content === "string" ? new TextEncoder().encode(content) : content;
            const stored = deflate ? new Uint8Array(zlib.deflateRawSync(data)) : data;
            const name = new TextEncoder().encode(path);
            const crc = ByteUtilities.crc32(data);
            const compression = deflate ? ZipReader.COMPRESSION_DEFLATE : ZipReader.COMPRESSION_STORED;
            const local = new Uint8Array(ZipReader.LOCAL_HEADER_LENGTH + name.length + stored.length);
            const localView = new DataView(local.buffer);

            localView.setUint32(0, ZipReader.LOCAL_HEADER_SIGNATURE, true);
            localView.setUint16(ZipReader.LOCAL_VERSION_OFFSET, ZipReader.ZIP_VERSION, true);
            localView.setUint16(ZipReader.LOCAL_COMPRESSION_OFFSET, compression, true);
            localView.setUint32(ZipReader.LOCAL_CRC_OFFSET, crc, true);
            localView.setUint32(ZipReader.LOCAL_COMPRESSED_SIZE_OFFSET, stored.length, true);
            localView.setUint32(ZipReader.LOCAL_UNCOMPRESSED_SIZE_OFFSET, data.length, true);
            localView.setUint16(ZipReader.LOCAL_NAME_LENGTH_OFFSET, name.length, true);
            local.set(name, ZipReader.LOCAL_HEADER_LENGTH);
            local.set(stored, ZipReader.LOCAL_HEADER_LENGTH + name.length);

            const central = new Uint8Array(ZipReader.CENTRAL_DIRECTORY_ENTRY_LENGTH + name.length);
            const centralView = new DataView(central.buffer);

            centralView.setUint32(0, ZipReader.CENTRAL_DIRECTORY_SIGNATURE, true);
            centralView.setUint16(ZipReader.CENTRAL_VERSION_MADE_OFFSET, ZipReader.ZIP_VERSION, true);
            centralView.setUint16(ZipReader.CENTRAL_VERSION_NEEDED_OFFSET, ZipReader.ZIP_VERSION, true);
            centralView.setUint16(ZipReader.CENTRAL_COMPRESSION_OFFSET, compression, true);
            centralView.setUint32(ZipReader.CENTRAL_CRC_OFFSET, crc, true);
            centralView.setUint32(ZipReader.CENTRAL_COMPRESSED_SIZE_OFFSET, stored.length, true);
            centralView.setUint32(ZipReader.CENTRAL_UNCOMPRESSED_SIZE_OFFSET, data.length, true);
            centralView.setUint16(ZipReader.CENTRAL_NAME_LENGTH_OFFSET, name.length, true);
            centralView.setUint32(ZipReader.CENTRAL_LOCAL_HEADER_OFFSET, offset, true);
            central.set(name, ZipReader.CENTRAL_DIRECTORY_ENTRY_LENGTH);

            locals.push(local);
            centrals.push(central);
            offset += local.length;
        }

        const centralSize = centrals.reduce((sum, part) => sum + part.length, 0);
        const end = new Uint8Array(ZipReader.END_OF_CENTRAL_DIRECTORY_LENGTH);
        const endView = new DataView(end.buffer);

        endView.setUint32(0, ZipReader.END_OF_CENTRAL_DIRECTORY_SIGNATURE, true);
        endView.setUint16(ZipReader.END_DISK_ENTRY_COUNT_OFFSET, centrals.length, true);
        endView.setUint16(ZipReader.END_ENTRY_COUNT_OFFSET, centrals.length, true);
        endView.setUint32(ZipReader.END_DIRECTORY_SIZE_OFFSET, centralSize, true);
        endView.setUint32(ZipReader.END_DIRECTORY_OFFSET, offset, true);

        return ByteUtilities.concat([...locals, ...centrals, end]);
    }
}
