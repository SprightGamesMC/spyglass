import type Check from "../Check.js";
import type { CheckGroup } from "../../Types/CheckTypes.js";
import DefinitionNameKeyMissing from "./DefinitionNameKeyMissing.js";
import EnUsMissing from "./EnUsMissing.js";
import LangFileMissing from "./LangFileMissing.js";
import LangFileNotInCatalog from "./LangFileNotInCatalog.js";
import LanguagesJsonInvalid from "./LanguagesJsonInvalid.js";
import LangKeyDuplicate from "./LangKeyDuplicate.js";
import LangLineInvalid from "./LangLineInvalid.js";
import LanguagesJsonMissing from "./LanguagesJsonMissing.js";
import ProfanityInText from "./ProfanityInText.js";

export default abstract class LangChecks {
    static readonly GROUP: CheckGroup = "LANG";
    static readonly LANGUAGES_JSON_MISSING = 101;
    static readonly EN_US_MISSING = 102;
    static readonly LANG_FILE_MISSING = 103;
    static readonly DEFINITION_NAME_KEY_MISSING = 104;
    static readonly LANGUAGES_JSON_INVALID = 201;
    static readonly LANG_LINE_INVALID = 202;
    static readonly LANG_FILE_NOT_IN_CATALOG = 301;
    static readonly LANG_KEY_DUPLICATE = 601;
    static readonly PROFANITY_IN_TEXT = 701;

    static create(): Check[] {
        return [
            new LanguagesJsonMissing(),
            new EnUsMissing(),
            new LangFileMissing(),
            new DefinitionNameKeyMissing(),
            new LanguagesJsonInvalid(),
            new LangFileNotInCatalog(),
            new LangLineInvalid(),
            new LangKeyDuplicate(),
            new ProfanityInText(),
        ];
    }
}
