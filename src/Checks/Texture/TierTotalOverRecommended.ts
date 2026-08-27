import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import TextureMemoryLoader from "../../Loaders/TextureMemoryLoader.js";
import Check from "../Check.js";
import TextureChecks from "./TextureChecks.js";
import TextureLimits from "./TextureLimits.js";

export default class TierTotalOverRecommended extends Check {
    readonly definition: CheckDefinition = {
        group: TextureChecks.GROUP,
        number: TextureChecks.TIER_TOTAL_OVER_RECOMMENDED,
        slug: "tier-total-over-recommended",
        severity: "warning",
        description: "Total texture memory over the limit for the tier",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const memory of await TextureMemoryLoader.load(context)) {
            for (const tier of TextureMemoryLoader.tiers(memory)) {
                const limit = TextureLimits.tierLimitBytes(context.contentType, tier.tier);

                if (tier.total <= limit) {
                    continue;
                }

                findings.push(
                    this.finding(
                        "Total texture memory at tier " +
                            tier.tier +
                            " is " +
                            TextureLimits.formatMebibytes(tier.total) +
                            ", over the limit of " +
                            TextureLimits.formatMebibytes(limit) +
                            " for " +
                            TextureLimits.tableFor(context.contentType) +
                            " content",
                        memory.pack.manifestPath,
                        memory.pack.root
                    )
                );
            }
        }

        return findings;
    }
}
