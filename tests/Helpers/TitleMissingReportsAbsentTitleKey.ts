import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { TitleMissingReportsAbsentTitleKeyCase } from "../Types/TitleMissingReportsAbsentTitleKeyTypes.js";
import TitleMissing from "../../src/Checks/Persona/TitleMissing.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class TitleMissingReportsAbsentTitleKey {
    static readonly ID = "PERSONA/103";
    static readonly CASES: readonly TitleMissingReportsAbsentTitleKeyCase[] = [
        { name: "persona.<id>.title key in en_US.lang gives the piece a title", files: PersonaFixture.pieceFiles({}), expectedIds: [] },
        {
            name: "persona.other.title key is a title for a different piece id",
            files: PersonaFixture.pieceFiles({ lang: "persona.other.title=Other\n" }),
            expectedIds: ["PERSONA/103"],
            expectedPaths: [PersonaFixture.LANG_PATH],
        },
        {
            name: "missing en_US.lang has no title key",
            files: PersonaFixture.pieceFiles({ lang: null }),
            expectedIds: ["PERSONA/103"],
            expectedPaths: [PersonaFixture.MANIFEST_PATH],
        },
    ];

    static run(entry: TitleMissingReportsAbsentTitleKeyCase): Promise<FindingSummary> {
        return PersonaFixture.summary(new TitleMissing(), entry.files, entry.contentType ?? "persona");
    }
}
