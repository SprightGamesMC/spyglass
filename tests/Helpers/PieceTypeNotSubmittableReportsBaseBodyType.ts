import type { Finding } from "../../src/Types/CheckTypes.js";
import type { PieceTypeNotSubmittableReportsBaseBodyTypeCase } from "../Types/PieceTypeNotSubmittableReportsBaseBodyTypeTypes.js";
import PieceTypeNotSubmittable from "../../src/Checks/Persona/PieceTypeNotSubmittable.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class PieceTypeNotSubmittableReportsBaseBodyType {
    static readonly ID = "PERSONA/701";
    static readonly CASES: readonly PieceTypeNotSubmittableReportsBaseBodyTypeCase[] = [
        { name: "persona_head piece type is submittable", files: PersonaFixture.pieceFiles({}), expectedIds: [] },
        {
            name: "persona_hair piece type is a base body type partners cannot submit",
            files: PersonaFixture.pieceFiles({ metaOverrides: { piece_type: "persona_hair" } }),
            expectedIds: ["PERSONA/701"],
        },
    ];

    static run(entry: PieceTypeNotSubmittableReportsBaseBodyTypeCase): Promise<Finding[]> {
        return PersonaFixture.run(new PieceTypeNotSubmittable(), entry.files, entry.contentType ?? "persona");
    }
}
