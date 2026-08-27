import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import Check from "../Check.js";
import ContentFiles from "./ContentFiles.js";
import PackChecks from "./PackChecks.js";
import PackLimits from "./PackLimits.js";

export default class FileCountOverLimit extends Check {
    readonly definition: CheckDefinition;

    private readonly limit: number;

    constructor(limit: number = PackLimits.FILE_COUNT_LIMIT) {
        super();
        this.limit = limit;
        this.definition = {
            group: PackChecks.GROUP,
            number: PackChecks.FILE_COUNT_OVER_LIMIT,
            slug: "file-count-over-limit",
            severity: "warning",
            description: "More than " + limit + " files",
        };
    }

    async run(context: CheckContext): Promise<Finding[]> {
        const count = ContentFiles.collect(context.model).length;

        if (count <= this.limit) {
            return [];
        }

        return [this.finding("Content has " + count + " files, limit is " + this.limit)];
    }
}
