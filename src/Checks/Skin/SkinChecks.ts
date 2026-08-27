import type Check from "../Check.js";
import type { CheckGroup } from "../../Types/CheckTypes.js";
import CapeNotAllowed from "./CapeNotAllowed.js";
import GeometryNotAllowed from "./GeometryNotAllowed.js";
import LangKeyNotInSkinsJson from "./LangKeyNotInSkinsJson.js";
import LocalizationNameMismatch from "./LocalizationNameMismatch.js";
import LocKeyMissing from "./LocKeyMissing.js";
import LocKeyWhitespace from "./LocKeyWhitespace.js";
import PurchaseTypeInvalid from "./PurchaseTypeInvalid.js";
import SkinsJsonInvalid from "./SkinsJsonInvalid.js";
import SkinsJsonMissing from "./SkinsJsonMissing.js";
import SkinNameInvalid from "./SkinNameInvalid.js";
import TextureDuplicate from "./TextureDuplicate.js";
import TextureInvalidSize from "./TextureInvalidSize.js";
import TextureNameNoModelTarget from "./TextureNameNoModelTarget.js";
import TextureNotInSkinsJson from "./TextureNotInSkinsJson.js";
import TooFewSkins from "./TooFewSkins.js";
import TooManyFreeSkins from "./TooManyFreeSkins.js";
import TooManySkins from "./TooManySkins.js";

export default abstract class SkinChecks {
    static readonly GROUP: CheckGroup = "SKIN";
    static readonly SKINS_JSON_MISSING = 101;
    static readonly LOC_KEY_MISSING = 102;
    static readonly SKINS_JSON_INVALID = 201;
    static readonly LOCALIZATION_NAME_MISMATCH = 202;
    static readonly TEXTURE_INVALID_SIZE = 203;
    static readonly GEOMETRY_NOT_ALLOWED = 204;
    static readonly TEXTURE_NAME_NO_MODEL_TARGET = 205;
    static readonly LOC_KEY_WHITESPACE = 206;
    static readonly PURCHASE_TYPE_INVALID = 207;
    static readonly SKIN_NAME_INVALID = 208;
    static readonly TEXTURE_NOT_IN_SKINS_JSON = 301;
    static readonly LANG_KEY_NOT_IN_SKINS_JSON = 302;
    static readonly TOO_MANY_SKINS = 401;
    static readonly TOO_MANY_FREE_SKINS = 402;
    static readonly TOO_FEW_SKINS = 403;
    static readonly TEXTURE_DUPLICATE = 601;
    static readonly CAPE_NOT_ALLOWED = 701;

    static create(): Check[] {
        return [
            new SkinsJsonMissing(),
            new LocKeyMissing(),
            new SkinsJsonInvalid(),
            new LocalizationNameMismatch(),
            new TextureInvalidSize(),
            new GeometryNotAllowed(),
            new TextureNameNoModelTarget(),
            new LocKeyWhitespace(),
            new PurchaseTypeInvalid(),
            new SkinNameInvalid(),
            new TextureNotInSkinsJson(),
            new LangKeyNotInSkinsJson(),
            new TooManySkins(),
            new TooManyFreeSkins(),
            new TooFewSkins(),
            new TextureDuplicate(),
            new CapeNotAllowed(),
        ];
    }
}
