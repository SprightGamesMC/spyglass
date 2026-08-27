import type Check from "../Check.js";
import type { CheckGroup } from "../../Types/CheckTypes.js";
import DefinitionsInvalid from "./DefinitionsInvalid.js";
import MultipleDefinitionsFiles from "./MultipleDefinitionsFiles.js";

export default abstract class SoundChecks {
    static readonly GROUP: CheckGroup = "SOUND";
    static readonly DEFINITIONS_INVALID = 201;
    static readonly MULTIPLE_DEFINITIONS_FILES = 601;

    static create(): Check[] {
        return [new DefinitionsInvalid(), new MultipleDefinitionsFiles()];
    }
}
