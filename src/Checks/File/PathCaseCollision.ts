import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import Check from "../Check.js";
import FileChecks from "./FileChecks.js";

export default class PathCaseCollision extends Check {
    readonly definition: CheckDefinition = {
        group: FileChecks.GROUP,
        number: FileChecks.PATH_CASE_COLLISION,
        slug: "path-case-collision",
        severity: "error",
        description: "Two paths differ only by letter case",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const groups = new Map<string, string[]>();

        for (const file of context.model.allFiles) {
            const key = file.path.toLowerCase();
            const members = groups.get(key) ?? [];

            members.push(file.path);
            groups.set(key, members);
        }

        const findings: Finding[] = [];

        for (const members of groups.values()) {
            if (members.length < 2) {
                continue;
            }

            findings.push(this.finding("Paths differ only by case: " + members.join(", "), members[0]));
        }

        return findings;
    }
}
