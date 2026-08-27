export interface FileEntry {
    readonly path: string;
    readonly size: number;
}

export interface Storage {
    listFiles(): readonly FileEntry[];
    readBytes(path: string): Promise<Uint8Array>;
}

export interface ArchiveEntry {
    readonly path: string;
    readonly compressedSize: number;
    readonly uncompressedSize: number;
    readonly compressionMethod: number;
    readonly localHeaderOffset: number;
}
