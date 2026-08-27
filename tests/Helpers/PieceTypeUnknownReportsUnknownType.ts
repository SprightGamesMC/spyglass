import type { Finding } from "../../src/Types/CheckTypes.js";
import type { PieceTypeUnknownReportsUnknownTypeCase } from "../Types/PieceTypeUnknownReportsUnknownTypeTypes.js";
import PieceTypeUnknown from "../../src/Checks/Persona/PieceTypeUnknown.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class PieceTypeUnknownReportsUnknownType {
    static readonly ID = "PERSONA/204";
    static readonly CASES: readonly PieceTypeUnknownReportsUnknownTypeCase[] = [
        { name: "persona_head is a known piece type", files: PersonaFixture.pieceFiles({}), expectedIds: [] },
        {
            name: "persona_wings is not a known piece type",
            files: PersonaFixture.pieceFiles({ metaOverrides: { piece_type: "persona_wings" } }),
            expectedIds: ["PERSONA/204"],
        },
    ];

    static run(entry: PieceTypeUnknownReportsUnknownTypeCase): Promise<Finding[]> {
        return PersonaFixture.run(new PieceTypeUnknown(), entry.files, entry.contentType ?? "persona");
    }
}
