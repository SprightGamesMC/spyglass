import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import Check from "../Check.js";
import AddonChecks from "./AddonChecks.js";
import AddonLimits from "./AddonLimits.js";

export default class FileCountOverLimit extends Check {
    readonly definition: CheckDefinition = {
        group: AddonChecks.GROUP,
        number: AddonChecks.FILE_COUNT_OVER_LIMIT,
        slug: "file-count-over-limit",
        severity: "error",
        description: "More than " + AddonLimits.FILE_COUNT_LIMIT + " files",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        let count = 0;

        for (const pack of context.model.packs) {
            count += pack.items.length;
        }

        if (count <= AddonLimits.FILE_COUNT_LIMIT) {
            return [];
        }

        return [this.finding("Content has " + count + " files, limit is " + AddonLimits.FILE_COUNT_LIMIT)];
    }
}
