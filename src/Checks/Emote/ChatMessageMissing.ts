import type { CheckDefinition } from "../../Types/CheckTypes.js";
import type { PersonaPackData } from "../../Types/PersonaTypes.js";
import PersonaLangKeyCheck from "../Common/PersonaLangKeyCheck.js";
import EmoteChecks from "./EmoteChecks.js";
import EmoteLimits from "./EmoteLimits.js";

export default class ChatMessageMissing extends PersonaLangKeyCheck {
    readonly definition: CheckDefinition = {
        group: EmoteChecks.GROUP,
        number: EmoteChecks.CHAT_MESSAGE_MISSING,
        slug: "chat-message-missing",
        severity: "error",
        description: "No persona.emote.chat_message key in en_US.lang",
    };

    protected key(data: PersonaPackData): string | undefined {
        return data.isEmote ? EmoteLimits.CHAT_MESSAGE_KEY : undefined;
    }
}
