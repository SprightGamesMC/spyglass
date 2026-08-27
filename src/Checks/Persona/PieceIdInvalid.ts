import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import ManifestLoader from "../../Loaders/ManifestLoader.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import Check from "../Check.js";
import PersonaChecks from "./PersonaChecks.js";

export default class PieceIdInvalid extends Check {
    readonly definition: CheckDefinition = {
        group: PersonaChecks.GROUP,
        number: PersonaChecks.PIECE_ID_INVALID,
        slug: "piece-id-invalid",
        severity: "error",
        description: "piece_id is not a GUID",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const data of await PersonaLoader.packs(context)) {
            const pieceId = PersonaLoader.string(data.meta, "piece_id");

            if (pieceId === undefined || data.metaPath === undefined || ManifestLoader.isValidUuid(pieceId)) {
                continue;
            }

            findings.push(this.finding("piece_id " + pieceId + " is not a GUID", data.metaPath, data.pack.root, { field: "piece_id" }));
        }

        return findings;
    }
}
