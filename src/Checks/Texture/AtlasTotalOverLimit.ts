import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import TextureMemoryLoader from "../../Loaders/TextureMemoryLoader.js";
import Check from "../Check.js";
import TextureChecks from "./TextureChecks.js";
import TextureLimits from "./TextureLimits.js";

export default class AtlasTotalOverLimit extends Check {
    readonly definition: CheckDefinition = {
        group: TextureChecks.GROUP,
        number: TextureChecks.ATLAS_TOTAL_OVER_LIMIT,
        slug: "atlas-total-over-limit",
        severity: "error",
        description: "Atlas total larger than " + TextureLimits.formatMebibytes(TextureLimits.ATLAS_TOTAL_LIMIT),
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const memory of await TextureMemoryLoader.load(context)) {
            for (const tier of TextureMemoryLoader.tiers(memory)) {
                if (!tier.computed) {
                    continue;
                }

                for (const { atlas, bytes: total } of TextureMemoryLoader.atlasTotals(tier)) {
                    if (total <= TextureLimits.ATLAS_TOTAL_LIMIT) {
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
                                ", over the " +
                                TextureLimits.formatMebibytes(TextureLimits.ATLAS_TOTAL_LIMIT) +
                                " limit",
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
