import type { Finding } from "../../src/Types/CheckTypes.js";
import type { IdentifierInvalidReportsBadCharactersAndTrailingPeriodCase } from "../Types/IdentifierInvalidReportsBadCharactersAndTrailingPeriodTypes.js";
import IdentifierInvalid from "../../src/Checks/Persona/IdentifierInvalid.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class IdentifierInvalidReportsBadCharactersAndTrailingPeriod {
    static readonly ID = "PERSONA/205";
    static readonly CASES: readonly IdentifierInvalidReportsBadCharactersAndTrailingPeriodCase[] = [
        {
            name: "Sp.right-hat_2 uses only letters digits underscore period and hyphen",
            files: PersonaFixture.pieceFiles({ metaOverrides: { piece_name: "Sp.right-hat_2" } }),
            expectedIds: [],
        },
        {
            name: "spright hat contains a space which is not an allowed character",
            files: PersonaFixture.pieceFiles({ metaOverrides: { piece_name: "spright hat" } }),
            expectedIds: ["PERSONA/205"],
        },
        {
            name: "spright_hat. ends in a period",
            files: PersonaFixture.pieceFiles({ metaOverrides: { piece_name: "spright_hat." } }),
            expectedIds: ["PERSONA/205"],
        },
    ];

    static run(entry: IdentifierInvalidReportsBadCharactersAndTrailingPeriodCase): Promise<Finding[]> {
        return PersonaFixture.run(new IdentifierInvalid(), entry.files, entry.contentType ?? "persona");
    }
}
