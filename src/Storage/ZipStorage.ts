import type { ArchiveEntry, FileEntry, Storage } from "../Types/StorageTypes.js";
import PathUtilities from "./PathUtilities.js";
import ZipReader from "./ZipReader.js";

export default class ZipStorage implements Storage {
    private static readonly ARCHIVE_EXTENSIONS: readonly string[] = ["zip", "mcaddon", "mctemplate", "mcpack", "mcworld", "mcpersona"];

    private readonly reader: ZipReader;
    private readonly entriesByPath = new Map<string, ArchiveEntry>();

    static isArchivePath(path: string): boolean {
        return ZipStorage.ARCHIVE_EXTENSIONS.includes(PathUtilities.extension(path));
    }

    constructor(bytes: Uint8Array) {
        this.reader = new ZipReader(bytes);

        for (const entry of this.reader.entries) {
            this.entriesByPath.set(entry.path, entry);
        }
    }

    listFiles(): readonly FileEntry[] {
        return [...this.entriesByPath.values()].map((entry) => ({ path: entry.path, size: entry.uncompressedSize }));
    }

    async readBytes(path: string): Promise<Uint8Array> {
        const entry = this.entriesByPath.get(PathUtilities.normalize(path));

        if (entry === undefined) {
            throw new Error("File not found: " + path);
        }

        return this.reader.read(entry);
    }
}
