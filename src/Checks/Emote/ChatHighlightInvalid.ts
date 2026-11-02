import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import Check from "../Check.js";
import EmoteChecks from "./EmoteChecks.js";
import EmoteLimits from "./EmoteLimits.js";

export default class ChatHighlightInvalid extends Check {
    readonly definition: CheckDefinition = {
        group: EmoteChecks.GROUP,
        number: EmoteChecks.CHAT_HIGHLIGHT_INVALID,
        slug: "chat-highlight-invalid",
        severity: "warning",
        description: "Chat message or easter egg has no pair of & characters, or an odd number",
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

                if (value === undefined) {
                    continue;
                }

                const count = value.split(EmoteLimits.CHAT_HIGHLIGHT_TOKEN).length - 1;

                if (count > 0 && count % 2 === 0) {
                    continue;
                }

                findings.push(
                    this.finding(key + " has " + count + " " + EmoteLimits.CHAT_HIGHLIGHT_TOKEN + " characters", lang.path, data.pack.root)
                );
            }
        }

        return findings;
    }
}
