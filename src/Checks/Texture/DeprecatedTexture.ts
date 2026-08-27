import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { Pack } from "../../Types/ModelTypes.js";
import TextureMemoryLoader from "../../Loaders/TextureMemoryLoader.js";
import PathUtilities from "../../Storage/PathUtilities.js";
import Check from "../Check.js";
import TextureChecks from "./TextureChecks.js";
import TextureLimits from "./TextureLimits.js";

export default class DeprecatedTexture extends Check {
    readonly definition: CheckDefinition = {
        group: TextureChecks.GROUP,
        number: TextureChecks.DEPRECATED_TEXTURE,
        slug: "deprecated-texture",
        severity: "warning",
        description: "Uses a deprecated vanilla texture file or entry",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const pack of context.model.packs) {
            findings.push(...this.deprecatedFiles(pack));
            findings.push(...(await this.deprecatedEntries(context, pack)));
        }

        return findings;
    }

    private deprecatedFiles(pack: Pack): Finding[] {
        const findings: Finding[] = [];

        for (const item of pack.items) {
            if (!TextureMemoryLoader.isImageItem(item)) {
                continue;
            }

            const key = TextureMemoryLoader.contentKey(item.packPath);
            const nameWithoutExtension = PathUtilities.nameWithoutExtension(key);

            if (
                !key.startsWith(TextureLimits.BLOCK_ATLAS_PREFIX) ||
                !TextureLimits.DEPRECATED_BLOCK_TEXTURES.includes(nameWithoutExtension)
            ) {
                continue;
            }

            findings.push(
                this.finding("Texture " + nameWithoutExtension + " is deprecated and should not be overridden", item.path, pack.root)
            );
        }

        return findings;
    }

    private async deprecatedEntries(context: CheckContext, pack: Pack): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const catalog of await TextureMemoryLoader.catalogs(context, pack)) {
            if (catalog.kind !== "block") {
                continue;
            }

            for (const entry of TextureLimits.DEPRECATED_TERRAIN_ENTRIES) {
                if (catalog.data[entry] === undefined) {
                    continue;
                }

                findings.push(
                    this.finding("Entry " + entry + " is deprecated and should not be overridden", catalog.item.path, pack.root, {
                        field: "texture_data." + entry,
                    })
                );
            }
        }

        return findings;
    }
}
