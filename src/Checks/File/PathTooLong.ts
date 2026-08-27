import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import Check from "../Check.js";
import FileChecks from "./FileChecks.js";
import FileLimits from "./FileLimits.js";
import MeasuredPaths from "./MeasuredPaths.js";

export default class PathTooLong extends Check {
    readonly definition: CheckDefinition = {
        group: FileChecks.GROUP,
        number: FileChecks.PATH_TOO_LONG,
        slug: "path-too-long",
        severity: "error",
        description: "Path longer than " + FileLimits.PATH_LENGTH_LIMIT + " characters",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const subject of MeasuredPaths.collect(context.model)) {
            const length = subject.measuredPath.length;

            if (length <= FileLimits.PATH_LENGTH_LIMIT) {
                continue;
            }

            findings.push(
                this.finding("Path is " + length + " characters, limit is " + FileLimits.PATH_LENGTH_LIMIT, subject.path, subject.pack)
            );
        }

        return findings;
    }
}
