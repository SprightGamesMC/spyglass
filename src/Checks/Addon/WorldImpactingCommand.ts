import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import MinecraftCommands from "../../Data/MinecraftCommands.js";
import CommandSourceLoader from "../../Loaders/CommandSourceLoader.js";
import Check from "../Check.js";
import AddonChecks from "./AddonChecks.js";

export default class WorldImpactingCommand extends Check {
    readonly definition: CheckDefinition = {
        group: AddonChecks.GROUP,
        number: AddonChecks.WORLD_IMPACTING_COMMAND,
        slug: "world-impacting-command",
        severity: "warning",
        description: "Command changes global world state",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const source of await CommandSourceLoader.load(context)) {
            if (!MinecraftCommands.isWorldImpacting(source.name)) {
                continue;
            }

            findings.push(
                this.finding(
                    "Command " + source.name + " changes the state of the whole world and should not be used in an add-on",
                    source.path,
                    source.pack,
                    source.line === undefined ? undefined : { line: source.line }
                )
            );
        }

        return findings;
    }
}
