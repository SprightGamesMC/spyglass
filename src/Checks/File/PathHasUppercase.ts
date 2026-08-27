import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import PathUtilities from "../../Storage/PathUtilities.js";
import Check from "../Check.js";
import FileChecks from "./FileChecks.js";
import FileLimits from "./FileLimits.js";
import MeasuredPaths from "./MeasuredPaths.js";

export default class PathHasUppercase extends Check {
    readonly definition: CheckDefinition = {
        group: FileChecks.GROUP,
        number: FileChecks.PATH_HAS_UPPERCASE,
        slug: "path-has-uppercase",
        severity: "recommendation",
        description: "Path contains uppercase letters",
    };

    private static isExempt(measuredPath: string): boolean {
        if (FileLimits.UPPERCASE_EXEMPT_EXTENSIONS.includes(PathUtilities.extension(measuredPath))) {
            return true;
        }

        const folders = PathUtilities.segments(measuredPath)
            .slice(0, -1)
            .map((segment) => segment.toLowerCase());

        return folders.some((folder) => FileLimits.UPPERCASE_EXEMPT_FOLDERS.includes(folder));
    }

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];
        const personaRoots = new Set(
            context.model.packs.filter((pack) => pack.type === PackItemLoader.PERSONA_PACK_TYPE).map((pack) => pack.root)
        );

        for (const subject of MeasuredPaths.collect(context.model)) {
            if (subject.pack !== undefined && personaRoots.has(subject.pack)) {
                continue;
            }

            if (PathHasUppercase.isExempt(subject.measuredPath) || context.loaders.vanilla.hasPath(subject.measuredPath)) {
                continue;
            }

            if (subject.measuredPath === subject.measuredPath.toLowerCase()) {
                continue;
            }

            findings.push(this.finding("Path " + subject.measuredPath + " contains uppercase letters", subject.path, subject.pack));
        }

        return findings;
    }
}
