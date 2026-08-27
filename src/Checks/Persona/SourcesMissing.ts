import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import Check from "../Check.js";
import PersonaChecks from "./PersonaChecks.js";
import PersonaLimits from "./PersonaLimits.js";

export default class SourcesMissing extends Check {
    readonly definition: CheckDefinition = {
        group: PersonaChecks.GROUP,
        number: PersonaChecks.SOURCES_MISSING,
        slug: "sources-missing",
        severity: "error",
        description: "Piece has neither texture_sources nor geometry_sources",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const data of await PersonaLoader.pieces(context)) {
            if (data.meta === undefined || data.metaPath === undefined) {
                continue;
            }

            if (
                PersonaLoader.hasSources(data.meta, PersonaLimits.TEXTURE_SOURCES_KEY) ||
                PersonaLoader.hasSources(data.meta, PersonaLimits.GEOMETRY_SOURCES_KEY)
            ) {
                continue;
            }

            findings.push(
                this.finding("Meta has neither texture_sources nor geometry_sources", data.metaPath, data.pack.root, {
                    field: PersonaLimits.TEXTURE_SOURCES_KEY,
                })
            );
        }

        return findings;
    }
}
