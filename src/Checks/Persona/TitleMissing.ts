import type { CheckDefinition } from "../../Types/CheckTypes.js";
import type { PersonaPackData } from "../../Types/PersonaTypes.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import PersonaLangKeyCheck from "../Common/PersonaLangKeyCheck.js";
import PersonaChecks from "./PersonaChecks.js";
import PersonaLimits from "./PersonaLimits.js";

export default class TitleMissing extends PersonaLangKeyCheck {
    readonly definition: CheckDefinition = {
        group: PersonaChecks.GROUP,
        number: PersonaChecks.TITLE_MISSING,
        slug: "title-missing",
        severity: "error",
        description: "No persona.<id>.title key in en_US.lang",
    };

    protected key(data: PersonaPackData): string | undefined {
        const pieceName = PersonaLoader.string(data.meta, "piece_name");

        return pieceName === undefined || data.isEmote ? undefined : PersonaLimits.TITLE_PREFIX + pieceName + PersonaLimits.TITLE_SUFFIX;
    }
}
