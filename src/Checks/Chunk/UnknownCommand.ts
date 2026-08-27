import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import MinecraftCommands from "../../Data/MinecraftCommands.js";
import WorldLoader from "../../Loaders/WorldLoader.js";
import Check from "../Check.js";
import ChunkChecks from "./ChunkChecks.js";

export default class UnknownCommand extends Check {
    readonly definition: CheckDefinition = {
        group: ChunkChecks.GROUP,
        number: ChunkChecks.UNKNOWN_COMMAND,
        slug: "unknown-command",
        severity: "error",
        description: "Command block command is not a built in command",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const world of context.model.worlds) {
            const data = await WorldLoader.load(context, world);

            for (const block of data.commandBlocks) {
                const name = MinecraftCommands.commandName(block.command);

                if (name === undefined || MinecraftCommands.isNamespaced(name) || MinecraftCommands.isBuiltIn(name)) {
                    continue;
                }

                findings.push(this.finding("Command " + name + " in command " + block.location + " is not a built in command", world.root));
            }
        }

        return findings;
    }
}
