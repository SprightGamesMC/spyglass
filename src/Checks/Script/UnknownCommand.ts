import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import CommandSourceLoader from "../../Loaders/CommandSourceLoader.js";
import MinecraftCommands from "../../Data/MinecraftCommands.js";
import Check from "../Check.js";
import ScriptChecks from "./ScriptChecks.js";

export default class UnknownCommand extends Check {
    readonly definition: CheckDefinition = {
        group: ScriptChecks.GROUP,
        number: ScriptChecks.UNKNOWN_COMMAND,
        slug: "unknown-command",
        severity: "error",
        description: "Command is not a built in command",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const source of await CommandSourceLoader.load(context)) {
            if (MinecraftCommands.isNamespaced(source.name) || MinecraftCommands.isBuiltIn(source.name)) {
                continue;
            }

            const message = "Command " + source.name + " is not a built in command";

            findings.push(this.finding(message, source.path, source.pack, source.line === undefined ? undefined : { line: source.line }));
        }

        return findings;
    }
}
