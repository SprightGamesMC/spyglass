import type { ContentModel } from "../../Types/ModelTypes.js";
import type { FileEntry } from "../../Types/StorageTypes.js";

export default abstract class ContentFiles {
    static collect(model: ContentModel): FileEntry[] {
        const byPath = new Map<string, FileEntry>();

        for (const pack of model.packs) {
            for (const item of pack.items) {
                byPath.set(item.path, { path: item.path, size: item.size });
            }
        }

        for (const world of model.worlds) {
            for (const item of world.items) {
                byPath.set(item.path, { path: item.path, size: item.size });
            }
        }

        return [...byPath.values()];
    }
}
