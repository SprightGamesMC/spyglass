import type { Finding } from "../../src/Types/CheckTypes.js";
import type { ChatHighlightInvalidReportsMissingOrOddAmpersandCase } from "../Types/ChatHighlightInvalidReportsMissingOrOddAmpersandTypes.js";
import ChatHighlightInvalid from "../../src/Checks/Emote/ChatHighlightInvalid.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class ChatHighlightInvalidReportsMissingOrOddAmpersand {
    static readonly ID = "EMOTE/213";
    static readonly CASES: readonly ChatHighlightInvalidReportsMissingOrOddAmpersandCase[] = [
        {
            name: "chat message and easter egg each contain a pair of & characters",
            files: PersonaFixture.emoteFiles({
                lang: "persona.offer.title=Wave\npersona.emote.chat_message=@ does the &Wave&\npersona.emote.easter_egg=@ does the &Big Wave&\n",
            }),
            expectedIds: [],
        },
        {
            name: "two pairs of & characters is an even number",
            files: PersonaFixture.emoteFiles({
                lang: "persona.offer.title=Wave\npersona.emote.chat_message=@ does &one& and &two&\npersona.emote.easter_egg=@ does the &Big Wave&\n",
            }),
            expectedIds: [],
        },
        {
            name: "chat message without & characters has no highlight",
            files: PersonaFixture.emoteFiles({
                lang: "persona.offer.title=Wave\npersona.emote.chat_message=@ waves\npersona.emote.easter_egg=@ does the &Big Wave&\n",
            }),
            expectedIds: ["EMOTE/213"],
        },
        {
            name: "easter egg with three & characters has an odd number",
            files: PersonaFixture.emoteFiles({
                lang: "persona.offer.title=Wave\npersona.emote.chat_message=@ does the &Wave&\npersona.emote.easter_egg=@ does &the &Big& Wave\n",
            }),
            expectedIds: ["EMOTE/213"],
        },
    ];

    static run(entry: ChatHighlightInvalidReportsMissingOrOddAmpersandCase): Promise<Finding[]> {
        return PersonaFixture.run(new ChatHighlightInvalid(), entry.files, entry.contentType ?? "persona");
    }
}
