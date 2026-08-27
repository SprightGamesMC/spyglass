import type { FileEntry, Storage } from "../Types/StorageTypes.js";
import fs from "node:fs";
import path from "node:path";
import PathUtilities from "./PathUtilities.js";

export default class FileSystemStorage implements Storage {
    private static readonly MAXIMUM_DEPTH = 15;

    private readonly root: string;
    private readonly entries: FileEntry[];

    private static scan(absoluteFolder: string, relativeFolder: string, depth: number): FileEntry[] {
        if (depth > FileSystemStorage.MAXIMUM_DEPTH) {
            return [];
        }

        const entries: FileEntry[] = [];
        const children = fs.readdirSync(absoluteFolder, { withFileTypes: true });

        for (const child of children) {
            const absoluteChild = path.join(absoluteFolder, child.name);
            const relativeChild = PathUtilities.join(relativeFolder, child.name);

            if (child.isDirectory()) {
                entries.push(...FileSystemStorage.scan(absoluteChild, relativeChild, depth + 1));
                continue;
            }

            if (!child.isFile()) {
                continue;
            }

            entries.push({ path: relativeChild, size: fs.statSync(absoluteChild).size });
        }

        return entries;
    }

    constructor(root: string) {
        this.root = path.resolve(root);
        this.entries = FileSystemStorage.scan(this.root, "", 0);
    }

    listFiles(): readonly FileEntry[] {
        return this.entries;
    }

    async readBytes(relativePath: string): Promise<Uint8Array> {
        const absolute = path.join(this.root, ...PathUtilities.segments(relativePath));
        const buffer = await fs.promises.readFile(absolute);

        return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    }
}
