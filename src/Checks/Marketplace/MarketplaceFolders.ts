import type { ContentModel, Pack } from "../../Types/ModelTypes.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import PathUtilities from "../../Storage/PathUtilities.js";
import MarketplaceLimits from "./MarketplaceLimits.js";

export default abstract class MarketplaceFolders {
    static contentPath(...parts: string[]): string {
        return PathUtilities.join(MarketplaceLimits.CONTENT_FOLDER, ...parts);
    }

    static hasFolder(model: ContentModel, folder: string): boolean {
        return model.allFiles.some((file) => PathUtilities.isInside(file.path, folder));
    }

    static findFolderIgnoringCase(model: ContentModel, folder: string): string | undefined {
        const wanted = folder.toLowerCase();
        const depth = PathUtilities.segments(folder).length;

        for (const file of model.allFiles) {
            const candidate = PathUtilities.segments(file.path).slice(0, depth).join("/");

            if (candidate.toLowerCase() === wanted) {
                return candidate;
            }
        }

        return undefined;
    }

    static folderName(pack: Pack): string {
        return PathUtilities.fileName(pack.root);
    }

    static parentFolderName(pack: Pack): string {
        return PathUtilities.fileName(PathUtilities.directory(pack.root));
    }

    static expectedPrefix(pack: Pack): string | undefined {
        if (pack.type === PackItemLoader.BEHAVIOR_PACK_TYPE) {
            return MarketplaceLimits.BEHAVIOR_PACK_PREFIX;
        }

        if (pack.type === PackItemLoader.RESOURCE_PACK_TYPE) {
            return MarketplaceLimits.RESOURCE_PACK_PREFIX;
        }

        return undefined;
    }

    static expectedParentFolder(pack: Pack): string | undefined {
        if (pack.type === PackItemLoader.BEHAVIOR_PACK_TYPE) {
            return MarketplaceLimits.BEHAVIOR_PACKS_FOLDER;
        }

        if (pack.type === PackItemLoader.RESOURCE_PACK_TYPE) {
            return MarketplaceLimits.RESOURCE_PACKS_FOLDER;
        }

        return undefined;
    }

    static acronym(pack: Pack): string | undefined {
        const prefix = MarketplaceFolders.expectedPrefix(pack);
        const name = MarketplaceFolders.folderName(pack);

        if (prefix === undefined || !name.startsWith(prefix)) {
            return undefined;
        }

        const acronym = name.slice(prefix.length);

        return MarketplaceLimits.ACRONYM_PATTERN.test(acronym) ? acronym : undefined;
    }

    static isNestedInWorld(model: ContentModel, pack: Pack): boolean {
        return model.worlds.some((world) => world.packs.includes(pack));
    }
}
