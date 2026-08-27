import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import Check from "../Check.js";
import EmoteChecks from "./EmoteChecks.js";
import EmoteLimits from "./EmoteLimits.js";

export default class ChatMessageNoPlayerToken extends Check {
    readonly definition: CheckDefinition = {
        group: EmoteChecks.GROUP,
        number: EmoteChecks.CHAT_MESSAGE_NO_PLAYER_TOKEN,
        slug: "chat-message-no-player-token",
        severity: "warning",
        description: "Chat message or easter egg has no @ player token",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const data of await PersonaLoader.emotes(context)) {
            const lang = await PersonaLoader.lang(context, data.pack);

            if (lang === undefined) {
                continue;
            }

            for (const key of EmoteLimits.PLAYER_TOKEN_KEYS) {
                const value = lang.entries.get(key);

                if (value === undefined || value.includes(EmoteLimits.PLAYER_TOKEN)) {
                    continue;
                }

                findings.push(this.finding(key + " has no " + EmoteLimits.PLAYER_TOKEN + " player token", lang.path, data.pack.root));
            }
        }

        return findings;
    }
}
