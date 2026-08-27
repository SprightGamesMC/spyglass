import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import TextureMemoryLoader from "../../Loaders/TextureMemoryLoader.js";
import Check from "../Check.js";
import TextureChecks from "./TextureChecks.js";
import TextureLimits from "./TextureLimits.js";

export default class MipOverRecommended extends Check {
    readonly definition: CheckDefinition = {
        group: TextureChecks.GROUP,
        number: TextureChecks.MIP_OVER_RECOMMENDED,
        slug: "mip-over-recommended",
        severity: "warning",
        description: "Single texture larger than " + TextureLimits.formatMebibytes(TextureLimits.MIP_LIMIT) + " at highest mip",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const memory of await TextureMemoryLoader.load(context)) {
            for (const image of memory.images) {
                if (image.bytes <= TextureLimits.MIP_LIMIT) {
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
                            " at the highest mip, over the recommended " +
                            TextureLimits.formatMebibytes(TextureLimits.MIP_LIMIT),
                        image.item.path,
                        memory.pack.root
                    )
                );
            }
        }

        return findings;
    }
}
