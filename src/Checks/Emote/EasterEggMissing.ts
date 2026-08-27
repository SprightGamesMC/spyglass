import type { CheckDefinition } from "../../Types/CheckTypes.js";
import type { PersonaPackData } from "../../Types/PersonaTypes.js";
import PersonaLangKeyCheck from "../Common/PersonaLangKeyCheck.js";
import EmoteChecks from "./EmoteChecks.js";
import EmoteLimits from "./EmoteLimits.js";

export default class EasterEggMissing extends PersonaLangKeyCheck {
    readonly definition: CheckDefinition = {
        group: EmoteChecks.GROUP,
        number: EmoteChecks.EASTER_EGG_MISSING,
        slug: "easter-egg-missing",
        severity: "error",
        description: "No persona.emote.easter_egg key in en_US.lang",
    };

    protected key(data: PersonaPackData): string | undefined {
        return data.isEmote ? EmoteLimits.EASTER_EGG_KEY : undefined;
    }
}
