import type { ArchiveEntry } from "../Types/StorageTypes.js";
import zlib from "node:zlib";
import PathUtilities from "./PathUtilities.js";

export default class ZipReader {
    static readonly END_OF_CENTRAL_DIRECTORY_SIGNATURE = 0x06054b50;
    static readonly CENTRAL_DIRECTORY_SIGNATURE = 0x02014b50;
    static readonly LOCAL_HEADER_SIGNATURE = 0x04034b50;
    static readonly ZIP_VERSION = 20;
    static readonly LOCAL_HEADER_LENGTH = 30;
    static readonly LOCAL_VERSION_OFFSET = 4;
    static readonly LOCAL_COMPRESSION_OFFSET = 8;
    static readonly LOCAL_CRC_OFFSET = 14;
    static readonly LOCAL_COMPRESSED_SIZE_OFFSET = 18;
    static readonly LOCAL_UNCOMPRESSED_SIZE_OFFSET = 22;
    static readonly LOCAL_NAME_LENGTH_OFFSET = 26;
    static readonly CENTRAL_DIRECTORY_ENTRY_LENGTH = 46;
    static readonly CENTRAL_VERSION_MADE_OFFSET = 4;
    static readonly CENTRAL_VERSION_NEEDED_OFFSET = 6;
    static readonly CENTRAL_COMPRESSION_OFFSET = 10;
    static readonly CENTRAL_CRC_OFFSET = 16;
    static readonly CENTRAL_COMPRESSED_SIZE_OFFSET = 20;
    static readonly CENTRAL_UNCOMPRESSED_SIZE_OFFSET = 24;
    static readonly CENTRAL_NAME_LENGTH_OFFSET = 28;
    static readonly CENTRAL_LOCAL_HEADER_OFFSET = 42;
    static readonly END_OF_CENTRAL_DIRECTORY_LENGTH = 22;
    static readonly END_DISK_ENTRY_COUNT_OFFSET = 8;
    static readonly END_ENTRY_COUNT_OFFSET = 10;
    static readonly END_DIRECTORY_SIZE_OFFSET = 12;
    static readonly END_DIRECTORY_OFFSET = 16;
    static readonly COMPRESSION_STORED = 0;
    static readonly COMPRESSION_DEFLATE = 8;
    private static readonly LOCAL_EXTRA_LENGTH_OFFSET = 28;
    private static readonly CENTRAL_EXTRA_LENGTH_OFFSET = 30;
    private static readonly CENTRAL_COMMENT_LENGTH_OFFSET = 32;
    private static readonly MAXIMUM_COMMENT_LENGTH = 65535;

    readonly entries: readonly ArchiveEntry[];

    private readonly bytes: Uint8Array;
    private readonly view: DataView;

    constructor(bytes: Uint8Array) {
        this.bytes = bytes;
        this.view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
        this.entries = this.readCentralDirectory();
    }

    read(entry: ArchiveEntry): Uint8Array {
        const headerOffset = entry.localHeaderOffset;

        if (
            headerOffset + ZipReader.LOCAL_HEADER_LENGTH > this.bytes.byteLength ||
            this.view.getUint32(headerOffset, true) !== ZipReader.LOCAL_HEADER_SIGNATURE
        ) {
            throw new Error("Invalid local header for " + entry.path);
        }

        const nameLength = this.view.getUint16(headerOffset + ZipReader.LOCAL_NAME_LENGTH_OFFSET, true);
        const extraLength = this.view.getUint16(headerOffset + ZipReader.LOCAL_EXTRA_LENGTH_OFFSET, true);
        const dataStart = headerOffset + ZipReader.LOCAL_HEADER_LENGTH + nameLength + extraLength;
        const dataEnd = dataStart + entry.compressedSize;

        if (dataEnd > this.bytes.byteLength) {
            throw new Error("Truncated entry " + entry.path);
        }

        const compressed = this.bytes.subarray(dataStart, dataEnd);

        if (entry.compressionMethod === ZipReader.COMPRESSION_STORED) {
            return compressed;
        }

        if (entry.compressionMethod === ZipReader.COMPRESSION_DEFLATE) {
            const inflated = zlib.inflateRawSync(compressed);

            return new Uint8Array(inflated.buffer, inflated.byteOffset, inflated.byteLength);
        }

        throw new Error("Unsupported compression method " + entry.compressionMethod + " for " + entry.path);
    }

    private readCentralDirectory(): ArchiveEntry[] {
        const endOffset = this.findEndOfCentralDirectory();
        const entryCount = this.view.getUint16(endOffset + ZipReader.END_ENTRY_COUNT_OFFSET, true);
        const directoryOffset = this.view.getUint32(endOffset + ZipReader.END_DIRECTORY_OFFSET, true);
        const entries: ArchiveEntry[] = [];
        let offset = directoryOffset;

        for (let index = 0; index < entryCount; index += 1) {
            if (
                offset + ZipReader.CENTRAL_DIRECTORY_ENTRY_LENGTH > this.bytes.byteLength ||
                this.view.getUint32(offset, true) !== ZipReader.CENTRAL_DIRECTORY_SIGNATURE
            ) {
                throw new Error("Invalid central directory entry");
            }

            const compressionMethod = this.view.getUint16(offset + ZipReader.CENTRAL_COMPRESSION_OFFSET, true);
            const compressedSize = this.view.getUint32(offset + ZipReader.CENTRAL_COMPRESSED_SIZE_OFFSET, true);
            const uncompressedSize = this.view.getUint32(offset + ZipReader.CENTRAL_UNCOMPRESSED_SIZE_OFFSET, true);
            const nameLength = this.view.getUint16(offset + ZipReader.CENTRAL_NAME_LENGTH_OFFSET, true);
            const extraLength = this.view.getUint16(offset + ZipReader.CENTRAL_EXTRA_LENGTH_OFFSET, true);
            const commentLength = this.view.getUint16(offset + ZipReader.CENTRAL_COMMENT_LENGTH_OFFSET, true);
            const localHeaderOffset = this.view.getUint32(offset + ZipReader.CENTRAL_LOCAL_HEADER_OFFSET, true);
            const nameStart = offset + ZipReader.CENTRAL_DIRECTORY_ENTRY_LENGTH;
            const rawName = new TextDecoder().decode(this.bytes.subarray(nameStart, nameStart + nameLength));
            const isFolder = rawName.endsWith("/");

            offset = nameStart + nameLength + extraLength + commentLength;

            if (isFolder) {
                continue;
            }

            entries.push({
                path: PathUtilities.normalize(rawName),
                compressedSize,
                uncompressedSize,
                compressionMethod,
                localHeaderOffset,
            });
        }

        return entries;
    }

    private findEndOfCentralDirectory(): number {
        const minimum = Math.max(0, this.bytes.byteLength - ZipReader.END_OF_CENTRAL_DIRECTORY_LENGTH - ZipReader.MAXIMUM_COMMENT_LENGTH);

        for (let offset = this.bytes.byteLength - ZipReader.END_OF_CENTRAL_DIRECTORY_LENGTH; offset >= minimum; offset -= 1) {
            if (this.view.getUint32(offset, true) === ZipReader.END_OF_CENTRAL_DIRECTORY_SIGNATURE) {
                return offset;
            }
        }

        throw new Error("Not a zip archive");
    }
}
