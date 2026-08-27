import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PathUtilities from "../../Storage/PathUtilities.js";
import Check from "../Check.js";
import FileChecks from "./FileChecks.js";
import FileLimits from "./FileLimits.js";
import MeasuredPaths from "./MeasuredPaths.js";

export default class PathTooDeep extends Check {
    readonly definition: CheckDefinition = {
        group: FileChecks.GROUP,
        number: FileChecks.PATH_TOO_DEEP,
        slug: "path-too-deep",
        severity: "error",
        description: "Path has more than " + FileLimits.PATH_DEPTH_LIMIT + " folder segments",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const subject of MeasuredPaths.collect(context.model)) {
            const folderCount = PathUtilities.segments(subject.measuredPath).length - 1;

            if (folderCount <= FileLimits.PATH_DEPTH_LIMIT) {
                continue;
            }

            findings.push(
                this.finding(
                    "Path has " + folderCount + " folder segments, limit is " + FileLimits.PATH_DEPTH_LIMIT,
                    subject.path,
                    subject.pack
                )
            );
        }

        return findings;
    }
}
