import type { Finding } from "../../src/Types/CheckTypes.js";
import type { MetaFieldMissingReportsAbsentRequiredFieldsCase } from "../Types/MetaFieldMissingReportsAbsentRequiredFieldsTypes.js";
import MetaFieldMissing from "../../src/Checks/Persona/MetaFieldMissing.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class MetaFieldMissingReportsAbsentRequiredFields {
    static readonly ID = "PERSONA/102";
    static readonly CASES: readonly MetaFieldMissingReportsAbsentRequiredFieldsCase[] = [
        {
            name: "meta with piece_id piece_name and piece_type has every required field",
            files: PersonaFixture.pieceFiles({}),
            expectedIds: [],
        },
        {
            name: "meta without piece_type lacks a required field",
            files: PersonaFixture.pieceFiles({ metaOverrides: { piece_type: undefined } }),
            expectedIds: ["PERSONA/102"],
        },
        {
            name: "meta without piece_id and piece_name lacks two required fields",
            files: PersonaFixture.pieceFiles({ metaOverrides: { piece_id: undefined, piece_name: undefined } }),
            expectedIds: PersonaFixture.repeat("PERSONA/102", 2),
        },
    ];

    static run(entry: MetaFieldMissingReportsAbsentRequiredFieldsCase): Promise<Finding[]> {
        return PersonaFixture.run(new MetaFieldMissing(), entry.files, entry.contentType ?? "persona");
    }
}
