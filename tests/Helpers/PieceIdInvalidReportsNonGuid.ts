import type { Finding } from "../../src/Types/CheckTypes.js";
import type { PieceIdInvalidReportsNonGuidCase } from "../Types/PieceIdInvalidReportsNonGuidTypes.js";
import PieceIdInvalid from "../../src/Checks/Persona/PieceIdInvalid.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class PieceIdInvalidReportsNonGuid {
    static readonly ID = "PERSONA/202";
    static readonly CASES: readonly PieceIdInvalidReportsNonGuidCase[] = [
        { name: "GUID piece_id is a valid id", files: PersonaFixture.pieceFiles({}), expectedIds: [] },
        {
            name: "piece_id not-a-guid is not a GUID",
            files: PersonaFixture.pieceFiles({ metaOverrides: { piece_id: "not-a-guid" } }),
            expectedIds: ["PERSONA/202"],
        },
    ];

    static run(entry: PieceIdInvalidReportsNonGuidCase): Promise<Finding[]> {
        return PersonaFixture.run(new PieceIdInvalid(), entry.files, entry.contentType ?? "persona");
    }
}
