import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import Check from "../Check.js";
import ContentFiles from "./ContentFiles.js";
import PackChecks from "./PackChecks.js";
import PackLimits from "./PackLimits.js";

export default class SizeOverLimit extends Check {
    readonly definition: CheckDefinition = {
        group: PackChecks.GROUP,
        number: PackChecks.SIZE_OVER_LIMIT,
        slug: "size-over-limit",
        severity: "error",
        description: "Content larger than " + PackLimits.SIZE_LIMIT_MEGABYTES + " MB",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const total = ContentFiles.collect(context.model).reduce((sum, file) => sum + file.size, 0);

        if (total <= PackLimits.SIZE_LIMIT_BYTES) {
            return [];
        }

        return [this.finding("Content is " + total + " bytes, limit is " + PackLimits.SIZE_LIMIT_BYTES)];
    }
}
