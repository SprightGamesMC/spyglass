import type { CheckDefinition } from "../../Types/CheckTypes.js";
import type { PersonaPackData } from "../../Types/PersonaTypes.js";
import PersonaLangKeyCheck from "../Common/PersonaLangKeyCheck.js";
import EmoteChecks from "./EmoteChecks.js";
import EmoteLimits from "./EmoteLimits.js";

export default class TitleMissing extends PersonaLangKeyCheck {
    readonly definition: CheckDefinition = {
        group: EmoteChecks.GROUP,
        number: EmoteChecks.TITLE_MISSING,
        slug: "title-missing",
        severity: "error",
        description: "No persona.offer.title key in en_US.lang",
    };

    protected key(data: PersonaPackData): string | undefined {
        return data.isEmote ? EmoteLimits.TITLE_KEY : undefined;
    }
}
