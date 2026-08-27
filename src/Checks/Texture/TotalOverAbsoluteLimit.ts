import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import TextureMemoryLoader from "../../Loaders/TextureMemoryLoader.js";
import Check from "../Check.js";
import TextureChecks from "./TextureChecks.js";
import TextureLimits from "./TextureLimits.js";

export default class TotalOverAbsoluteLimit extends Check {
    readonly definition: CheckDefinition = {
        group: TextureChecks.GROUP,
        number: TextureChecks.TOTAL_OVER_ABSOLUTE_LIMIT,
        slug: "total-over-absolute-limit",
        severity: "error",
        description: "Total texture memory over the tier " + TextureLimits.HIGHEST_TIER + " limit",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];
        const limit = TextureLimits.tierLimitBytes(context.contentType, TextureLimits.HIGHEST_TIER);

        for (const memory of await TextureMemoryLoader.load(context)) {
            const highest = Math.max(...TextureMemoryLoader.tiers(memory).map((tier) => tier.total));

            if (highest <= limit) {
                continue;
            }

            findings.push(
                this.finding(
                    "Total texture memory is " +
                        TextureLimits.formatMebibytes(highest) +
                        ", over the absolute " +
                        TextureLimits.formatMebibytes(limit) +
                        " limit for " +
                        TextureLimits.tableFor(context.contentType) +
                        " content",
                    memory.pack.manifestPath,
                    memory.pack.root
                )
            );
        }

        return findings;
    }
}
