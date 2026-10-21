import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { TextureImage } from "../../Types/TextureTypes.js";
import CrossReferenceLoader from "../../Loaders/CrossReferenceLoader.js";
import TextureMemoryLoader from "../../Loaders/TextureMemoryLoader.js";
import PathUtilities from "../../Storage/PathUtilities.js";
import Check from "../Check.js";
import TextureChecks from "./TextureChecks.js";
import TextureLimits from "./TextureLimits.js";

export default class TextureWithoutTextureSet extends Check {
    readonly definition: CheckDefinition = {
        group: TextureChecks.GROUP,
        number: TextureChecks.TEXTURE_WITHOUT_TEXTURE_SET,
        slug: "texture-without-texture-set",
        severity: "warning",
        description: "Pack has pbr capability and a texture has no texture set",
    };

    private static async referencedKeys(context: CheckContext): Promise<Set<string>> {
        const sourcePaths = new Set(
            context.model.packs
                .flatMap((pack) => pack.items)
                .filter((item) => TextureLimits.TEXTURE_SET_SOURCE_KINDS.includes(item.kind))
                .map((item) => item.path)
        );
        const index = await CrossReferenceLoader.load(context);

        return new Set(
            index.references
                .filter((reference) => reference.kind === "texture" && sourcePaths.has(reference.path))
                .map((reference) => reference.id)
        );
    }

    private static folderOf(key: string): string | undefined {
        const folders = key.split("/").slice(1, -1);

        return folders
            .slice(0, TextureLimits.ADDON_FOLDER_DEPTH + 1)
            .find((folder) => TextureLimits.TEXTURE_SET_FOLDERS.includes(folder) || TextureLimits.NO_TEXTURE_SET_FOLDERS.includes(folder));
    }

    private static needsTextureSet(context: CheckContext, image: TextureImage, referencedKeys: ReadonlySet<string>): boolean {
        const folder = TextureWithoutTextureSet.folderOf(image.key);

        if (folder !== undefined && TextureLimits.NO_TEXTURE_SET_FOLDERS.includes(folder)) {
            return false;
        }

        if (context.loaders.vanilla.hasPath(image.key + TextureLimits.TEXTURE_SET_SUFFIX)) {
            return true;
        }

        return folder !== undefined || referencedKeys.has(image.key);
    }

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];
        const memories = (await TextureMemoryLoader.load(context)).filter((memory) =>
            memory.capabilities.includes(TextureLimits.PBR_CAPABILITY)
        );

        if (memories.length === 0) {
            return findings;
        }

        const referencedKeys = await TextureWithoutTextureSet.referencedKeys(context);

        for (const memory of memories) {
            const textureSetPaths = new Set(
                memory.pack.items.filter((item) => item.kind === "texture_set").map((item) => item.packPath.toLowerCase())
            );

            for (const image of memory.images) {
                if (
                    !TextureWithoutTextureSet.needsTextureSet(context, image, referencedKeys) ||
                    TextureMemoryLoader.isCompanion(image, memory)
                ) {
                    continue;
                }

                const expected = PathUtilities.withoutExtension(image.item.packPath).toLowerCase() + TextureLimits.TEXTURE_SET_SUFFIX;

                if (textureSetPaths.has(expected)) {
                    continue;
                }

                findings.push(
                    this.finding("Pack declares the pbr capability but texture has no " + expected, image.item.path, memory.pack.root)
                );
            }
        }

        return findings;
    }
}
