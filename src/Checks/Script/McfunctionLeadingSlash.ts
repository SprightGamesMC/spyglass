import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import CommandSourceLoader from "../../Loaders/CommandSourceLoader.js";
import Check from "../Check.js";
import ScriptChecks from "./ScriptChecks.js";

export default class McfunctionLeadingSlash extends Check {
    readonly definition: CheckDefinition = {
        group: ScriptChecks.GROUP,
        number: ScriptChecks.MCFUNCTION_LEADING_SLASH,
        slug: "mcfunction-leading-slash",
        severity: "warning",
        description: ".mcfunction line begins with /",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const source of await CommandSourceLoader.load(context)) {
            if (source.line === undefined || !source.leadingSlash) {
                continue;
            }

            const message = "Line " + source.line + " begins with /: " + source.command;

            findings.push(this.finding(message, source.path, source.pack, { line: source.line }));
        }

        return findings;
    }
}
