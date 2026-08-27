import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import WorldLoader from "../../Loaders/WorldLoader.js";
import Check from "../Check.js";
import ChunkChecks from "./ChunkChecks.js";
import ChunkLimits from "./ChunkLimits.js";

export default class CommandFromOlderVersion extends Check {
    readonly definition: CheckDefinition = {
        group: ChunkChecks.GROUP,
        number: ChunkChecks.COMMAND_FROM_OLDER_VERSION,
        slug: "command-from-older-version",
        severity: "recommendation",
        description: "Command block command is from a version older than " + ChunkLimits.MODERN_COMMAND_GAME_VERSION,
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const world of context.model.worlds) {
            const data = await WorldLoader.load(context, world);

            for (const block of data.commandBlocks) {
                if (block.version === undefined || block.version >= ChunkLimits.MODERN_COMMAND_VERSION) {
                    continue;
                }

                findings.push(
                    this.finding(
                        "Command " +
                            JSON.stringify(block.command) +
                            " in command " +
                            block.location +
                            " has version " +
                            block.version +
                            ", below " +
                            ChunkLimits.MODERN_COMMAND_VERSION +
                            " (" +
                            ChunkLimits.MODERN_COMMAND_GAME_VERSION +
                            ")",
                        world.root
                    )
                );
            }
        }

        return findings;
    }
}
