import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import TextureMemoryLoader from "../../Loaders/TextureMemoryLoader.js";
import Check from "../Check.js";
import AddonChecks from "./AddonChecks.js";
import AddonLimits from "./AddonLimits.js";

export default class TextureTotalOverBaseLimit extends Check {
    readonly definition: CheckDefinition = {
        group: AddonChecks.GROUP,
        number: AddonChecks.TEXTURE_TOTAL_OVER_BASE_LIMIT,
        slug: "texture-total-over-base-limit",
        severity: "error",
        description:
            "No subpack declares a tier and total texture memory exceeds " + AddonLimits.BASE_TEXTURE_MEMORY_LIMIT_MEBIBYTES + " MiB",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const memory of await TextureMemoryLoader.load(context)) {
            if (memory.pack.type !== PackItemLoader.RESOURCE_PACK_TYPE || memory.subpacks.some((subpack) => subpack.tier !== undefined)) {
                continue;
            }

            const base = TextureMemoryLoader.tiers(memory).find((tier) => tier.tier === AddonLimits.BASE_TIER);
            const total = base?.total ?? 0;

            if (total <= AddonLimits.BASE_TEXTURE_MEMORY_LIMIT_BYTES) {
                continue;
            }

            findings.push(
                this.finding(
                    "Total texture memory is " +
                        total +
                        " bytes, limit is " +
                        AddonLimits.BASE_TEXTURE_MEMORY_LIMIT_BYTES +
                        " without a declared subpack tier",
                    memory.pack.manifestPath,
                    memory.pack.root
                )
            );
        }

        return findings;
    }
}
