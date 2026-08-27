import type { Finding } from "../../src/Types/CheckTypes.js";
import type { ChatMessageNoPlayerTokenReportsMissingAtCase } from "../Types/ChatMessageNoPlayerTokenReportsMissingAtTypes.js";
import ChatMessageNoPlayerToken from "../../src/Checks/Emote/ChatMessageNoPlayerToken.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class ChatMessageNoPlayerTokenReportsMissingAt {
    static readonly ID = "EMOTE/210";
    static readonly CASES: readonly ChatMessageNoPlayerTokenReportsMissingAtCase[] = [
        { name: "chat message and easter egg both contain the @ player token", files: PersonaFixture.emoteFiles({}), expectedIds: [] },
        {
            name: "chat message Someone waves has no @ player token",
            files: PersonaFixture.emoteFiles({
                lang: "persona.offer.title=Wave\npersona.emote.chat_message=Someone waves\npersona.emote.easter_egg=@ waves\n",
            }),
            expectedIds: ["EMOTE/210"],
        },
        {
            name: "chat message and easter egg both lack the @ player token",
            files: PersonaFixture.emoteFiles({
                lang: "persona.offer.title=Wave\npersona.emote.chat_message=Someone waves\npersona.emote.easter_egg=Waves\n",
            }),
            expectedIds: PersonaFixture.repeat("EMOTE/210", 2),
        },
    ];

    static run(entry: ChatMessageNoPlayerTokenReportsMissingAtCase): Promise<Finding[]> {
        return PersonaFixture.run(new ChatMessageNoPlayerToken(), entry.files, entry.contentType ?? "persona");
    }
}
