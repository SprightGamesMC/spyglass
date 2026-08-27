import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PathUtilities from "../../Storage/PathUtilities.js";
import Check from "../Check.js";
import FileChecks from "./FileChecks.js";
import FileLimits from "./FileLimits.js";
import MeasuredPaths from "./MeasuredPaths.js";

export default class PathInvalidCharacter extends Check {
    readonly definition: CheckDefinition = {
        group: FileChecks.GROUP,
        number: FileChecks.PATH_INVALID_CHARACTER,
        slug: "path-invalid-character",
        severity: "error",
        description: "Path contains a character or name that is not safe on every platform",
    };

    private static problemsOf(segment: string): string[] {
        const problems: string[] = [];
        const invalid = FileLimits.INVALID_CHARACTERS.exec(segment);

        if (invalid !== null) {
            problems.push("segment " + segment + " contains " + invalid[0]);
        }

        if (PathInvalidCharacter.hasControlCharacter(segment)) {
            problems.push("segment " + segment + " contains a control character");
        }

        if (segment.endsWith(".") || segment.endsWith(" ")) {
            problems.push("segment " + segment + " ends with a dot or space");
        }

        const nameWithoutExtension = PathUtilities.nameWithoutExtension(segment).toUpperCase();

        if (FileLimits.RESERVED_NAMES.includes(nameWithoutExtension)) {
            problems.push("segment " + segment + " uses the reserved name " + nameWithoutExtension);
        }

        return problems;
    }

    private static hasControlCharacter(segment: string): boolean {
        for (const character of segment) {
            const codePoint = character.codePointAt(0) ?? 0;

            if (codePoint <= FileLimits.CONTROL_CHARACTER_LIMIT) {
                return true;
            }
        }

        return false;
    }

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const subject of MeasuredPaths.collect(context.model)) {
            const problems = PathUtilities.segments(subject.measuredPath).flatMap((segment) => PathInvalidCharacter.problemsOf(segment));

            if (problems.length === 0) {
                continue;
            }

            findings.push(this.finding("Path " + subject.measuredPath + ": " + problems.join(", "), subject.path, subject.pack));
        }

        return findings;
    }
}
