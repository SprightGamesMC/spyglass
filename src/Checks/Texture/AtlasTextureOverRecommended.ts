import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import TextureMemoryLoader from "../../Loaders/TextureMemoryLoader.js";
import Check from "../Check.js";
import TextureChecks from "./TextureChecks.js";
import TextureLimits from "./TextureLimits.js";

export default class AtlasTextureOverRecommended extends Check {
    readonly definition: CheckDefinition = {
        group: TextureChecks.GROUP,
        number: TextureChecks.ATLAS_TEXTURE_OVER_RECOMMENDED,
        slug: "atlas-texture-over-recommended",
        severity: "warning",
        description: "Single atlas texture larger than " + TextureLimits.formatBytes(TextureLimits.ATLAS_TEXTURE_LIMIT),
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const memory of await TextureMemoryLoader.load(context)) {
            for (const image of memory.images) {
                if (image.atlas === undefined || image.bytes <= TextureLimits.ATLAS_TEXTURE_LIMIT) {
                    continue;
                }

                findings.push(
                    this.finding(
                        "Atlas texture is " +
                            image.width +
                            "x" +
                            image.height +
                            ", " +
                            TextureLimits.formatBytes(image.bytes) +
                            ", over the recommended " +
                            TextureLimits.formatBytes(TextureLimits.ATLAS_TEXTURE_LIMIT) +
                            " for a " +
                            image.atlas +
                            " atlas texture",
                        image.item.path,
                        memory.pack.root
                    )
                );
            }
        }

        return findings;
    }
}
