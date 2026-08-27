import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import TextureMemoryLoader from "../../Loaders/TextureMemoryLoader.js";
import Check from "../Check.js";
import TextureChecks from "./TextureChecks.js";
import TextureLimits from "./TextureLimits.js";

export default class TargetedTierOverLimit extends Check {
    readonly definition: CheckDefinition = {
        group: TextureChecks.GROUP,
        number: TextureChecks.TARGETED_TIER_OVER_LIMIT,
        slug: "targeted-tier-over-limit",
        severity: "error",
        description: "A subpack declares a tier and total texture memory exceeds that tier limit",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const memory of await TextureMemoryLoader.load(context)) {
            for (const tier of TextureMemoryLoader.tiers(memory)) {
                const limit = TextureLimits.tierLimitBytes(context.contentType, tier.tier);

                if (!tier.targeted || tier.total <= limit) {
                    continue;
                }

                findings.push(
                    this.finding(
                        "A subpack targets tier " +
                            tier.tier +
                            " and total texture memory there is " +
                            TextureLimits.formatMebibytes(tier.total) +
                            ", over the " +
                            TextureLimits.formatMebibytes(limit) +
                            " limit for " +
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
