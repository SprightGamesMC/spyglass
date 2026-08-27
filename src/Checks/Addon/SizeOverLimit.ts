import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import Check from "../Check.js";
import AddonChecks from "./AddonChecks.js";
import AddonLimits from "./AddonLimits.js";

export default class SizeOverLimit extends Check {
    readonly definition: CheckDefinition = {
        group: AddonChecks.GROUP,
        number: AddonChecks.SIZE_OVER_LIMIT,
        slug: "size-over-limit",
        severity: "error",
        description: "Content larger than " + AddonLimits.SIZE_LIMIT_MEGABYTES + " MB",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        let total = 0;

        for (const pack of context.model.packs) {
            for (const item of pack.items) {
                total += item.size;
            }
        }

        if (total <= AddonLimits.SIZE_LIMIT_BYTES) {
            return [];
        }

        return [this.finding("Content size is " + total + " bytes uncompressed, limit is " + AddonLimits.SIZE_LIMIT_BYTES)];
    }
}
