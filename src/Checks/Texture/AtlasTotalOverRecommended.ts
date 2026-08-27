import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import TextureMemoryLoader from "../../Loaders/TextureMemoryLoader.js";
import Check from "../Check.js";
import TextureChecks from "./TextureChecks.js";
import TextureLimits from "./TextureLimits.js";

export default class AtlasTotalOverRecommended extends Check {
    readonly definition: CheckDefinition = {
        group: TextureChecks.GROUP,
        number: TextureChecks.ATLAS_TOTAL_OVER_RECOMMENDED,
        slug: "atlas-total-over-recommended",
        severity: "warning",
        description: "Atlas total larger than " + TextureLimits.formatMebibytes(TextureLimits.ATLAS_TOTAL_RECOMMENDED),
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const memory of await TextureMemoryLoader.load(context)) {
            for (const tier of TextureMemoryLoader.tiers(memory)) {
                if (!tier.computed) {
                    continue;
                }

                for (const { atlas, bytes: total } of TextureMemoryLoader.atlasTotals(tier)) {
                    if (total <= TextureLimits.ATLAS_TOTAL_RECOMMENDED || total > TextureLimits.ATLAS_TOTAL_LIMIT) {
                        continue;
                    }

                    findings.push(
                        this.finding(
                            "The " +
                                atlas +
                                " atlas at tier " +
                                tier.tier +
                                " is " +
                                TextureLimits.formatMebibytes(total) +
                                ", over the recommended " +
                                TextureLimits.formatMebibytes(TextureLimits.ATLAS_TOTAL_RECOMMENDED),
                            memory.pack.manifestPath,
                            memory.pack.root
                        )
                    );
                }
            }
        }

        return findings;
    }
}
