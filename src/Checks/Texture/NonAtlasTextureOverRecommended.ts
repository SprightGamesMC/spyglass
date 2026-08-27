import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import TextureMemoryLoader from "../../Loaders/TextureMemoryLoader.js";
import Check from "../Check.js";
import TextureChecks from "./TextureChecks.js";
import TextureLimits from "./TextureLimits.js";

export default class NonAtlasTextureOverRecommended extends Check {
    readonly definition: CheckDefinition = {
        group: TextureChecks.GROUP,
        number: TextureChecks.NON_ATLAS_TEXTURE_OVER_RECOMMENDED,
        slug: "non-atlas-texture-over-recommended",
        severity: "warning",
        description: "Single non atlas texture larger than " + TextureLimits.formatMebibytes(TextureLimits.NON_ATLAS_TEXTURE_LIMIT),
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const memory of await TextureMemoryLoader.load(context)) {
            for (const image of memory.images) {
                if (image.atlas !== undefined || image.bytes <= TextureLimits.NON_ATLAS_TEXTURE_LIMIT) {
                    continue;
                }

                findings.push(
                    this.finding(
                        "Texture is " +
                            image.width +
                            "x" +
                            image.height +
                            ", " +
                            TextureLimits.formatMebibytes(image.bytes) +
                            ", over the recommended " +
                            TextureLimits.formatMebibytes(TextureLimits.NON_ATLAS_TEXTURE_LIMIT) +
                            " for a non atlas texture",
                        image.item.path,
                        memory.pack.root
                    )
                );
            }
        }

        return findings;
    }
}
