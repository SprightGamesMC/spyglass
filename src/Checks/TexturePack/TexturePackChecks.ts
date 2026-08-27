import type Check from "../Check.js";
import type { CheckGroup } from "../../Types/CheckTypes.js";
import BehaviorPackNotAllowed from "./BehaviorPackNotAllowed.js";
import CoverageTooLow from "./CoverageTooLow.js";
import MultipleResourcePacks from "./MultipleResourcePacks.js";
import ResourcePackMissing from "./ResourcePackMissing.js";
import VanillaTextureNotOverridden from "./VanillaTextureNotOverridden.js";

export default abstract class TexturePackChecks {
    static readonly GROUP: CheckGroup = "TEXTUREPACK";
    static readonly RESOURCE_PACK_MISSING = 101;
    static readonly VANILLA_TEXTURE_NOT_OVERRIDDEN = 301;
    static readonly COVERAGE_TOO_LOW = 401;
    static readonly MULTIPLE_RESOURCE_PACKS = 601;
    static readonly BEHAVIOR_PACK_NOT_ALLOWED = 701;

    static create(): Check[] {
        return [
            new ResourcePackMissing(),
            new VanillaTextureNotOverridden(),
            new CoverageTooLow(),
            new MultipleResourcePacks(),
            new BehaviorPackNotAllowed(),
        ];
    }
}
