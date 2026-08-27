import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { ChatMessageMissingReportsAbsentKeyCase } from "../Types/ChatMessageMissingReportsAbsentKeyTypes.js";
import ChatMessageMissing from "../../src/Checks/Emote/ChatMessageMissing.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class ChatMessageMissingReportsAbsentKey {
    static readonly ID = "EMOTE/102";
    static readonly CASES: readonly ChatMessageMissingReportsAbsentKeyCase[] = [
        { name: "en_US.lang with persona.emote.chat_message has the key", files: PersonaFixture.emoteFiles({}), expectedIds: [] },
        {
            name: "en_US.lang without persona.emote.chat_message lacks the key",
            files: PersonaFixture.emoteFiles({ lang: "persona.offer.title=Wave\npersona.emote.easter_egg=@ waves\n" }),
            expectedIds: ["EMOTE/102"],
            expectedPaths: [PersonaFixture.LANG_PATH],
        },
        {
            name: "missing en_US.lang has no persona.emote.chat_message key",
            files: PersonaFixture.emoteFiles({ lang: null }),
            expectedIds: ["EMOTE/102"],
            expectedPaths: [PersonaFixture.MANIFEST_PATH],
        },
    ];

    static run(entry: ChatMessageMissingReportsAbsentKeyCase): Promise<FindingSummary> {
        return PersonaFixture.summary(new ChatMessageMissing(), entry.files, entry.contentType ?? "persona");
    }
}
