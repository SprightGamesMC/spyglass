import type { FileEntry, Storage } from "../../../src/Types/StorageTypes.js";
import PathUtilities from "../../../src/Storage/PathUtilities.js";

export default class MemoryStorage implements Storage {
    private readonly files = new Map<string, Uint8Array>();
    private readonly unreadable = new Set<string>();

    constructor(files?: Readonly<Record<string, Uint8Array | string>>) {
        if (files === undefined) {
            return;
        }

        for (const [path, content] of Object.entries(files)) {
            this.addFile(path, content);
        }
    }

    addFile(path: string, content: Uint8Array | string): void {
        const bytes = typeof content === "string" ? new TextEncoder().encode(content) : content;

        this.files.set(PathUtilities.normalize(path), bytes);
    }

    addJson(path: string, value: unknown): void {
        this.addFile(path, JSON.stringify(value, null, 2));
    }

    addUnreadable(path: string): void {
        this.unreadable.add(PathUtilities.normalize(path));
        this.files.set(PathUtilities.normalize(path), new Uint8Array(0));
    }

    listFiles(): readonly FileEntry[] {
        return [...this.files.entries()].map(([path, bytes]) => ({ path, size: bytes.byteLength }));
    }

    async readBytes(path: string): Promise<Uint8Array> {
        const normalized = PathUtilities.normalize(path);

        if (this.unreadable.has(normalized)) {
            throw new Error("Read failure for " + normalized);
        }

        const bytes = this.files.get(normalized);

        if (bytes === undefined) {
            throw new Error("File not found: " + normalized);
        }

        return bytes;
    }
}
