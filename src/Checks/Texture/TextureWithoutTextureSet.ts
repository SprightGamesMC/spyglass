import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
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

    private static isBlockOrEntity(key: string): boolean {
        return key.startsWith(TextureLimits.BLOCK_ATLAS_PREFIX) || key.startsWith(TextureLimits.ENTITY_PREFIX);
    }

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const memory of await TextureMemoryLoader.load(context)) {
            if (!memory.capabilities.includes(TextureLimits.PBR_CAPABILITY)) {
                continue;
            }

            const textureSetPaths = new Set(
                memory.pack.items.filter((item) => item.kind === "texture_set").map((item) => item.packPath.toLowerCase())
            );

            for (const image of memory.images) {
                if (!TextureWithoutTextureSet.isBlockOrEntity(image.key) || TextureMemoryLoader.isCompanion(image, memory)) {
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
