import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { EasterEggMissingReportsAbsentKeyCase } from "../Types/EasterEggMissingReportsAbsentKeyTypes.js";
import EasterEggMissing from "../../src/Checks/Emote/EasterEggMissing.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class EasterEggMissingReportsAbsentKey {
    static readonly ID = "EMOTE/103";
    static readonly CASES: readonly EasterEggMissingReportsAbsentKeyCase[] = [
        { name: "en_US.lang with persona.emote.easter_egg has the key", files: PersonaFixture.emoteFiles({}), expectedIds: [] },
        {
            name: "en_US.lang without persona.emote.easter_egg lacks the key",
            files: PersonaFixture.emoteFiles({ lang: "persona.offer.title=Wave\npersona.emote.chat_message=@ waves\n" }),
            expectedIds: ["EMOTE/103"],
            expectedPaths: [PersonaFixture.LANG_PATH],
        },
    ];

    static run(entry: EasterEggMissingReportsAbsentKeyCase): Promise<FindingSummary> {
        return PersonaFixture.summary(new EasterEggMissing(), entry.files, entry.contentType ?? "persona");
    }
}
