import type { CreatorFolder, FolderChildren } from "../../Types/AddonTypes.js";
import type { ContentItem, Pack } from "../../Types/ModelTypes.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import SubpackFormat from "../../Loaders/SubpackFormat.js";
import PathUtilities from "../../Storage/PathUtilities.js";
import AddonLimits from "./AddonLimits.js";

export default abstract class AddonPackFolders {
    static typeFolders(pack: Pack): readonly string[] {
        const folders: string[] = [];

        for (const scope of AddonPackFolders.scopes(pack)) {
            for (const folder of AddonPackFolders.children(pack, scope).folders) {
                if (scope === "" && folder.toLowerCase() === SubpackFormat.FOLDER) {
                    continue;
                }

                folders.push(scope === "" ? folder : scope + "/" + folder);
            }
        }

        return folders;
    }

    static scopes(pack: Pack): readonly string[] {
        const subpacksFolder = AddonPackFolders.children(pack, "").folders.find((folder) => folder.toLowerCase() === SubpackFormat.FOLDER);

        if (subpacksFolder === undefined) {
            return [""];
        }

        return ["", ...AddonPackFolders.children(pack, subpacksFolder).folders.map((folder) => subpacksFolder + "/" + folder)];
    }

    static typeFolderName(typeFolder: string): string {
        const segments = PathUtilities.segments(typeFolder);

        return segments.length === 0 ? "" : segments[segments.length - 1];
    }

    static isNamespacedPathFolder(typeFolder: string): boolean {
        return AddonLimits.NAMESPACED_PATH_FOLDERS.includes(AddonPackFolders.typeFolderName(typeFolder).toLowerCase());
    }

    static creatorFolders(pack: Pack): CreatorFolder[] {
        const result: CreatorFolder[] = [];

        for (const typeFolder of AddonPackFolders.typeFolders(pack)) {
            if (!AddonPackFolders.isScannedTypeFolder(pack, typeFolder) || AddonPackFolders.isStructuresFolder(typeFolder)) {
                continue;
            }

            for (const creatorFolder of AddonPackFolders.children(pack, typeFolder).folders) {
                result.push({ typeFolder, creatorFolder });
            }
        }

        return result;
    }

    static children(pack: Pack, folderPath: string): FolderChildren {
        const prefix = folderPath === "" ? "" : folderPath + "/";
        const files: ContentItem[] = [];
        const folders = new Set<string>();

        for (const item of pack.items) {
            if (!item.packPath.startsWith(prefix)) {
                continue;
            }

            const remainder = item.packPath.slice(prefix.length);
            const separator = remainder.indexOf("/");

            if (separator < 0) {
                files.push(item);
                continue;
            }

            folders.add(remainder.slice(0, separator));
        }

        return { files, folders: [...folders].sort() };
    }

    static isScannedTypeFolder(pack: Pack, folder: string): boolean {
        const unscanned =
            pack.type === PackItemLoader.BEHAVIOR_PACK_TYPE
                ? AddonLimits.BEHAVIOR_UNSCANNED_FOLDERS
                : AddonLimits.RESOURCE_UNSCANNED_FOLDERS;

        return !unscanned.includes(AddonPackFolders.typeFolderName(folder).toLowerCase());
    }

    static isStructuresFolder(folder: string): boolean {
        return AddonPackFolders.typeFolderName(folder).toLowerCase() === AddonLimits.STRUCTURES_FOLDER;
    }

    static isCatalogFile(typeFolder: string, path: string): boolean {
        const names = AddonLimits.CATALOG_FILES[AddonPackFolders.typeFolderName(typeFolder).toLowerCase()] ?? [];

        return names.includes(PathUtilities.fileName(path).toLowerCase());
    }

    static folderPath(pack: Pack, ...segments: string[]): string {
        return PathUtilities.join(pack.root, ...segments);
    }
}
