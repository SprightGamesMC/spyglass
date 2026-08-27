import type Check from "../Check.js";
import type { CheckGroup } from "../../Types/CheckTypes.js";
import AtlasTextureOverRecommended from "./AtlasTextureOverRecommended.js";
import AtlasTotalOverLimit from "./AtlasTotalOverLimit.js";
import AtlasTotalOverRecommended from "./AtlasTotalOverRecommended.js";
import BaseContentUnusedInLowerTiers from "./BaseContentUnusedInLowerTiers.js";
import DeprecatedTexture from "./DeprecatedTexture.js";
import ImageUnreadable from "./ImageUnreadable.js";
import MerTexturesInLowTier from "./MerTexturesInLowTier.js";
import MipOverRecommended from "./MipOverRecommended.js";
import NonAtlasTextureOverRecommended from "./NonAtlasTextureOverRecommended.js";
import NotInTextureList from "./NotInTextureList.js";
import TargetedTierOverLimit from "./TargetedTierOverLimit.js";
import TextureSetInTextureList from "./TextureSetInTextureList.js";
import TextureSetLayerNotFound from "./TextureSetLayerNotFound.js";
import TextureWithoutTextureSet from "./TextureWithoutTextureSet.js";
import TieringInvalid from "./TieringInvalid.js";
import TieringInvalidForVibrantVisuals from "./TieringInvalidForVibrantVisuals.js";
import TierTotalOverRecommended from "./TierTotalOverRecommended.js";
import TotalOverAbsoluteLimit from "./TotalOverAbsoluteLimit.js";

export default abstract class TextureChecks {
    static readonly GROUP: CheckGroup = "TEXTURE";
    static readonly IMAGE_UNREADABLE = 201;
    static readonly TIERING_INVALID = 202;
    static readonly TIERING_INVALID_FOR_VIBRANT_VISUALS = 203;
    static readonly NOT_IN_TEXTURE_LIST = 301;
    static readonly TEXTURE_SET_IN_TEXTURE_LIST = 302;
    static readonly BASE_CONTENT_UNUSED_IN_LOWER_TIERS = 303;
    static readonly TEXTURE_WITHOUT_TEXTURE_SET = 304;
    static readonly TEXTURE_SET_LAYER_NOT_FOUND = 305;
    static readonly NON_ATLAS_TEXTURE_OVER_RECOMMENDED = 401;
    static readonly ATLAS_TEXTURE_OVER_RECOMMENDED = 402;
    static readonly MIP_OVER_RECOMMENDED = 403;
    static readonly ATLAS_TOTAL_OVER_RECOMMENDED = 404;
    static readonly ATLAS_TOTAL_OVER_LIMIT = 405;
    static readonly TIER_TOTAL_OVER_RECOMMENDED = 406;
    static readonly TARGETED_TIER_OVER_LIMIT = 407;
    static readonly TOTAL_OVER_ABSOLUTE_LIMIT = 408;
    static readonly DEPRECATED_TEXTURE = 501;
    static readonly MER_TEXTURES_IN_LOW_TIER = 601;

    static create(): Check[] {
        return [
            new ImageUnreadable(),
            new TieringInvalid(),
            new TieringInvalidForVibrantVisuals(),
            new NotInTextureList(),
            new TextureSetInTextureList(),
            new BaseContentUnusedInLowerTiers(),
            new TextureWithoutTextureSet(),
            new TextureSetLayerNotFound(),
            new NonAtlasTextureOverRecommended(),
            new AtlasTextureOverRecommended(),
            new MipOverRecommended(),
            new AtlasTotalOverRecommended(),
            new AtlasTotalOverLimit(),
            new TierTotalOverRecommended(),
            new TargetedTierOverLimit(),
            new TotalOverAbsoluteLimit(),
            new DeprecatedTexture(),
            new MerTexturesInLowTier(),
        ];
    }
}
