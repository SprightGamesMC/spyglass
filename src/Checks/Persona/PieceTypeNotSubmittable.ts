import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import Check from "../Check.js";
import PersonaChecks from "./PersonaChecks.js";
import PersonaLimits from "./PersonaLimits.js";

export default class PieceTypeNotSubmittable extends Check {
    readonly definition: CheckDefinition = {
        group: PersonaChecks.GROUP,
        number: PersonaChecks.PIECE_TYPE_NOT_SUBMITTABLE,
        slug: "piece-type-not-submittable",
        severity: "error",
        description: "piece_type is a base body type partners cannot submit",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const data of await PersonaLoader.packs(context)) {
            const pieceType = PersonaLoader.string(data.meta, "piece_type");

            if (pieceType === undefined || data.metaPath === undefined || !PersonaLimits.NOT_SUBMITTABLE_PIECE_TYPES.includes(pieceType)) {
                continue;
            }

            findings.push(
                this.finding("piece_type " + pieceType + " is a base body type partners cannot submit", data.metaPath, data.pack.root, {
                    field: "piece_type",
                })
            );
        }

        return findings;
    }
}
