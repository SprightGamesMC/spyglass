import type Check from "../Check.js";
import type { CheckGroup } from "../../Types/CheckTypes.js";
import BaseGameVersionAboveCurrent from "./BaseGameVersionAboveCurrent.js";
import BaseGameVersionBelowCurrent from "./BaseGameVersionBelowCurrent.js";
import BaseGameVersionMissing from "./BaseGameVersionMissing.js";
import BaseGameVersionWildcard from "./BaseGameVersionWildcard.js";
import ExperimentEnabled from "./ExperimentEnabled.js";
import IconInvalidImage from "./IconInvalidImage.js";
import IconInvalidSize from "./IconInvalidSize.js";
import IconMissing from "./IconMissing.js";
import LevelDatMissing from "./LevelDatMissing.js";
import DatabaseMissing from "./DatabaseMissing.js";
import LevelnameMissing from "./LevelnameMissing.js";
import LockTemplateOptionsMissing from "./LockTemplateOptionsMissing.js";
import MashupCoverageLow from "./MashupCoverageLow.js";
import MultipleIcons from "./MultipleIcons.js";
import PackReferenceIdInvalid from "./PackReferenceIdInvalid.js";
import PackReferenceNotFound from "./PackReferenceNotFound.js";
import PackReferencesInvalid from "./PackReferencesInvalid.js";
import PackReferenceVersionInvalid from "./PackReferenceVersionInvalid.js";
import TooManyTextureHandles from "./TooManyTextureHandles.js";

export default abstract class WorldChecks {
    static readonly GROUP: CheckGroup = "WORLD";
    static readonly LEVEL_DAT_MISSING = 101;
    static readonly ICON_MISSING = 102;
    static readonly BASE_GAME_VERSION_MISSING = 103;
    static readonly LOCK_TEMPLATE_OPTIONS_MISSING = 104;
    static readonly LEVELNAME_MISSING = 105;
    static readonly DATABASE_MISSING = 106;
    static readonly ICON_INVALID_IMAGE = 201;
    static readonly ICON_INVALID_SIZE = 202;
    static readonly PACK_REFERENCES_INVALID = 203;
    static readonly PACK_REFERENCE_ID_INVALID = 204;
    static readonly PACK_REFERENCE_VERSION_INVALID = 205;
    static readonly BASE_GAME_VERSION_WILDCARD = 206;
    static readonly PACK_REFERENCE_NOT_FOUND = 301;
    static readonly TOO_MANY_TEXTURE_HANDLES = 401;
    static readonly BASE_GAME_VERSION_BELOW_CURRENT = 501;
    static readonly BASE_GAME_VERSION_ABOVE_CURRENT = 502;
    static readonly MULTIPLE_ICONS = 601;
    static readonly EXPERIMENT_ENABLED = 701;
    static readonly MASHUP_COVERAGE_LOW = 702;

    static create(): Check[] {
        return [
            new LevelDatMissing(),
            new IconMissing(),
            new BaseGameVersionMissing(),
            new LockTemplateOptionsMissing(),
            new LevelnameMissing(),
            new DatabaseMissing(),
            new IconInvalidImage(),
            new IconInvalidSize(),
            new PackReferencesInvalid(),
            new PackReferenceIdInvalid(),
            new PackReferenceVersionInvalid(),
            new BaseGameVersionWildcard(),
            new PackReferenceNotFound(),
            new TooManyTextureHandles(),
            new BaseGameVersionBelowCurrent(),
            new BaseGameVersionAboveCurrent(),
            new MultipleIcons(),
            new ExperimentEnabled(),
            new MashupCoverageLow(),
        ];
    }
}
