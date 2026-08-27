import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { ContentItem } from "../../Types/ModelTypes.js";
import TextureSuffixes from "../../Data/TextureSuffixes.js";
import VanillaEnginePaths from "../../Data/VanillaEnginePaths.js";
import CrossReferenceLoader from "../../Loaders/CrossReferenceLoader.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import SubpackFormat from "../../Loaders/SubpackFormat.js";
import PathUtilities from "../../Storage/PathUtilities.js";
import Check from "../Check.js";
import PackChecks from "./PackChecks.js";
import PackLimits from "./PackLimits.js";

export default class AssetUnused extends Check {
    readonly definition: CheckDefinition = {
        group: PackChecks.GROUP,
        number: PackChecks.ASSET_UNUSED,
        slug: "asset-unused",
        severity: "warning",
        description: "Texture or sound file not referenced by anything",
    };

    private static describe(item: ContentItem): string {
        return item.kind === "texture" ? "Texture" : "Sound";
    }

    private static isTextureSetCompanion(item: ContentItem): boolean {
        const nameWithoutExtension = PathUtilities.nameWithoutExtension(item.packPath).toLowerCase();

        return TextureSuffixes.hasSuffix(nameWithoutExtension, PackLimits.TEXTURE_SET_COMPANION_SUFFIXES);
    }

    async run(context: CheckContext): Promise<Finding[]> {
        const index = await CrossReferenceLoader.load(context);
        const referenced = new Set(
            index.references
                .filter((reference) => reference.kind === "texture" || reference.kind === "sound")
                .map((reference) => reference.id)
        );
        const prefixes = index.references.filter((reference) => reference.kind === "texture_prefix").map((reference) => reference.id);
        const findings: Finding[] = [];

        for (const pack of context.model.packs) {
            if (pack.type !== PackItemLoader.RESOURCE_PACK_TYPE) {
                continue;
            }

            for (const item of pack.items) {
                if (!this.isUnused(context, item, referenced, prefixes)) {
                    continue;
                }

                findings.push(
                    this.finding(
                        AssetUnused.describe(item) + " " + item.packPath + " is not referenced by any definition",
                        item.path,
                        pack.root
                    )
                );
            }
        }

        return findings;
    }

    private static isVanillaPath(context: CheckContext, item: ContentItem, contentPath: string): boolean {
        if (item.kind === "texture") {
            return context.loaders.vanilla.hasTexturePath(PathUtilities.withoutExtension(contentPath));
        }

        if (context.loaders.vanilla.hasPath(contentPath)) {
            return true;
        }

        const id = PathUtilities.normalizeReference(contentPath);

        return id !== undefined && context.loaders.vanilla.hasSoundPath(id);
    }

    private isUnused(context: CheckContext, item: ContentItem, referenced: ReadonlySet<string>, prefixes: readonly string[]): boolean {
        const folder = PackLimits.ASSET_FOLDERS[item.kind];
        const contentPath = SubpackFormat.pathWithoutSubpack(item.packPath);

        if (folder === undefined || !contentPath.toLowerCase().startsWith(folder)) {
            return false;
        }

        if (
            AssetUnused.isVanillaPath(context, item, contentPath) ||
            VanillaEnginePaths.isEnginePath(contentPath) ||
            AssetUnused.isTextureSetCompanion(item)
        ) {
            return false;
        }

        const id = PathUtilities.normalizeReference(contentPath);

        if (id === undefined || referenced.has(id)) {
            return false;
        }

        return !prefixes.some((prefix) => id.startsWith(prefix));
    }
}
