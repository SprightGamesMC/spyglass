import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { TitleMissingReportsAbsentOfferTitleCase } from "../Types/TitleMissingReportsAbsentOfferTitleTypes.js";
import TitleMissing from "../../src/Checks/Emote/TitleMissing.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class TitleMissingReportsAbsentOfferTitle {
    static readonly ID = "EMOTE/104";
    static readonly CASES: readonly TitleMissingReportsAbsentOfferTitleCase[] = [
        { name: "persona.offer.title key in en_US.lang gives the emote a title", files: PersonaFixture.emoteFiles({}), expectedIds: [] },
        {
            name: "en_US.lang with only chat_message and easter_egg keys has no persona.offer.title",
            files: PersonaFixture.emoteFiles({ lang: "persona.emote.chat_message=@ waves\npersona.emote.easter_egg=@ waves\n" }),
            expectedIds: ["EMOTE/104"],
            expectedPaths: [PersonaFixture.LANG_PATH],
        },
    ];

    static run(entry: TitleMissingReportsAbsentOfferTitleCase): Promise<FindingSummary> {
        return PersonaFixture.summary(new TitleMissing(), entry.files, entry.contentType ?? "persona");
    }
}
