import type { Finding } from "../../src/Types/CheckTypes.js";
import type { IdentifierInvalidReportsBadEmoteIdentifierCase } from "../Types/IdentifierInvalidReportsBadEmoteIdentifierTypes.js";
import IdentifierInvalid from "../../src/Checks/Emote/IdentifierInvalid.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class IdentifierInvalidReportsBadEmoteIdentifier {
    static readonly ID = "EMOTE/202";
    static readonly CASES: readonly IdentifierInvalidReportsBadEmoteIdentifierCase[] = [
        {
            name: "em_spright_wave has the em_ prefix and a studio prefix in lower case",
            files: PersonaFixture.emoteFiles({}),
            expectedIds: [],
        },
        {
            name: "em_Spright_wave has an upper case letter",
            files: PersonaFixture.emoteFiles({ metaOverrides: { piece_name: "em_Spright_wave" } }),
            expectedIds: ["EMOTE/202"],
        },
        {
            name: "spright_wave does not start with em_",
            files: PersonaFixture.emoteFiles({ metaOverrides: { piece_name: "spright_wave" } }),
            expectedIds: ["EMOTE/202"],
        },
        {
            name: "em_wave has no studio prefix between em_ and the name",
            files: PersonaFixture.emoteFiles({ metaOverrides: { piece_name: "em_wave" } }),
            expectedIds: ["EMOTE/202"],
        },
    ];

    static run(entry: IdentifierInvalidReportsBadEmoteIdentifierCase): Promise<Finding[]> {
        return PersonaFixture.run(new IdentifierInvalid(), entry.files, entry.contentType ?? "persona");
    }
}
