import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import Check from "../Check.js";
import PersonaChecks from "./PersonaChecks.js";
import PersonaLimits from "./PersonaLimits.js";

export default class PieceTypeUnknown extends Check {
    readonly definition: CheckDefinition = {
        group: PersonaChecks.GROUP,
        number: PersonaChecks.PIECE_TYPE_UNKNOWN,
        slug: "piece-type-unknown",
        severity: "error",
        description: "piece_type is not a known value",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const data of await PersonaLoader.packs(context)) {
            const pieceType = PersonaLoader.string(data.meta, "piece_type");

            if (pieceType === undefined || data.metaPath === undefined || PersonaLimits.PIECE_TYPES.includes(pieceType)) {
                continue;
            }

            findings.push(
                this.finding("piece_type " + pieceType + " is not a known piece type", data.metaPath, data.pack.root, {
                    field: "piece_type",
                })
            );
        }

        return findings;
    }
}
