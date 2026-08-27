import type Check from "../Check.js";
import type { CheckGroup } from "../../Types/CheckTypes.js";
import ApprovalSheetMissing from "./ApprovalSheetMissing.js";
import ApprovalSheetSizeInvalid from "./ApprovalSheetSizeInvalid.js";
import FileNameInvalid from "./FileNameInvalid.js";
import MarketingArtDpiInvalid from "./MarketingArtDpiInvalid.js";
import MarketingArtFolderMissing from "./MarketingArtFolderMissing.js";
import MarketingArtFormatInvalid from "./MarketingArtFormatInvalid.js";
import MarketingArtSizeInvalid from "./MarketingArtSizeInvalid.js";
import MarketingKeyArtMissing from "./MarketingKeyArtMissing.js";
import MarketingPartnerArtMissing from "./MarketingPartnerArtMissing.js";
import MarketingScreenshotsTooFew from "./MarketingScreenshotsTooFew.js";
import BlockbenchProjectMissing from "./BlockbenchProjectMissing.js";
import NamePrefixMismatch from "./NamePrefixMismatch.js";
import PersonaArtFormatInvalid from "./PersonaArtFormatInvalid.js";
import PersonaThumbnailNotTransparent from "./PersonaThumbnailNotTransparent.js";
import PreviewGifMissing from "./PreviewGifMissing.js";
import SideloadPackMissing from "./SideloadPackMissing.js";
import StoreArtDpiInvalid from "./StoreArtDpiInvalid.js";
import StoreArtFolderMissing from "./StoreArtFolderMissing.js";
import StoreArtFormatInvalid from "./StoreArtFormatInvalid.js";
import StorePackIconMissing from "./StorePackIconMissing.js";
import StorePackIconSizeInvalid from "./StorePackIconSizeInvalid.js";
import StorePanoramaMissing from "./StorePanoramaMissing.js";
import StorePanoramaSizeInvalid from "./StorePanoramaSizeInvalid.js";
import StoreScreenshotCountInvalid from "./StoreScreenshotCountInvalid.js";
import StoreScreenshotSizeInvalid from "./StoreScreenshotSizeInvalid.js";
import StoreThumbnailMissing from "./StoreThumbnailMissing.js";
import StoreThumbnailSizeInvalid from "./StoreThumbnailSizeInvalid.js";

export default abstract class ArtChecks {
    static readonly GROUP: CheckGroup = "ART";
    static readonly MARKETING_ART_FOLDER_MISSING = 101;
    static readonly STORE_ART_FOLDER_MISSING = 102;
    static readonly MARKETING_KEY_ART_MISSING = 103;
    static readonly MARKETING_PARTNER_ART_MISSING = 104;
    static readonly STORE_THUMBNAIL_MISSING = 105;
    static readonly STORE_PANORAMA_MISSING = 106;
    static readonly STORE_PACK_ICON_MISSING = 107;
    static readonly APPROVAL_SHEET_MISSING = 108;
    static readonly PREVIEW_GIF_MISSING = 109;
    static readonly SIDELOAD_PACK_MISSING = 110;
    static readonly BLOCKBENCH_PROJECT_MISSING = 111;
    static readonly FILE_NAME_INVALID = 201;
    static readonly NAME_PREFIX_MISMATCH = 202;
    static readonly STORE_ART_FORMAT_INVALID = 203;
    static readonly STORE_THUMBNAIL_SIZE_INVALID = 204;
    static readonly STORE_SCREENSHOT_SIZE_INVALID = 205;
    static readonly STORE_PANORAMA_SIZE_INVALID = 206;
    static readonly STORE_PACK_ICON_SIZE_INVALID = 207;
    static readonly STORE_ART_DPI_INVALID = 208;
    static readonly MARKETING_ART_FORMAT_INVALID = 209;
    static readonly MARKETING_ART_SIZE_INVALID = 210;
    static readonly MARKETING_ART_DPI_INVALID = 211;
    static readonly PERSONA_ART_FORMAT_INVALID = 212;
    static readonly APPROVAL_SHEET_SIZE_INVALID = 213;
    static readonly PERSONA_THUMBNAIL_NOT_TRANSPARENT = 214;
    static readonly MARKETING_SCREENSHOTS_TOO_FEW = 401;
    static readonly STORE_SCREENSHOT_COUNT_INVALID = 402;

    static create(): Check[] {
        return [
            new MarketingArtFolderMissing(),
            new StoreArtFolderMissing(),
            new MarketingKeyArtMissing(),
            new MarketingPartnerArtMissing(),
            new StoreThumbnailMissing(),
            new StorePanoramaMissing(),
            new StorePackIconMissing(),
            new ApprovalSheetMissing(),
            new PreviewGifMissing(),
            new SideloadPackMissing(),
            new BlockbenchProjectMissing(),
            new FileNameInvalid(),
            new NamePrefixMismatch(),
            new StoreArtFormatInvalid(),
            new StoreThumbnailSizeInvalid(),
            new StoreScreenshotSizeInvalid(),
            new StorePanoramaSizeInvalid(),
            new StorePackIconSizeInvalid(),
            new StoreArtDpiInvalid(),
            new MarketingArtFormatInvalid(),
            new MarketingArtSizeInvalid(),
            new MarketingArtDpiInvalid(),
            new PersonaArtFormatInvalid(),
            new ApprovalSheetSizeInvalid(),
            new PersonaThumbnailNotTransparent(),
            new MarketingScreenshotsTooFew(),
            new StoreScreenshotCountInvalid(),
        ];
    }
}
