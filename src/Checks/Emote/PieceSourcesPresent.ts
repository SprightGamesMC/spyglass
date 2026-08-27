import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import Check from "../Check.js";
import EmoteChecks from "./EmoteChecks.js";
import EmoteLimits from "./EmoteLimits.js";

export default class PieceSourcesPresent extends Check {
    readonly definition: CheckDefinition = {
        group: EmoteChecks.GROUP,
        number: EmoteChecks.PIECE_SOURCES_PRESENT,
        slug: "piece-sources-present",
        severity: "error",
        description: "Emote meta has texture_sources or geometry_sources",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const data of await PersonaLoader.emotes(context)) {
            if (data.meta === undefined || data.metaPath === undefined) {
                continue;
            }

            for (const field of EmoteLimits.PIECE_SOURCE_FIELDS) {
                if (data.meta[field] === undefined) {
                    continue;
                }

                findings.push(this.finding("Emote meta has " + field, data.metaPath, data.pack.root, { field }));
            }
        }

        return findings;
    }
}
