import type { ArtNameKind, ArtNamePatterns } from "../../Types/ArtTypes.js";
import type { ArtFolder } from "../../Types/ModelTypes.js";

export default abstract class ArtLimits {
    static readonly MARKETING_FOLDER: ArtFolder = "Marketing Art";
    static readonly STORE_FOLDER: ArtFolder = "Store Art";
    static readonly KEY_ART_SUFFIX = "_MarketingKeyArt";
    static readonly PARTNER_ART_SUFFIX = "_PartnerArt";
    static readonly MARKETING_SCREENSHOT_SUFFIX = "_MarketingScreenshot_";
    static readonly THUMBNAIL_SUFFIX = "_Thumbnail_";
    static readonly STORE_SCREENSHOT_SUFFIX = "_screenshot_";
    static readonly PANORAMA_SUFFIX = "_panorama_";
    static readonly PACK_ICON_SUFFIX = "_packicon_";
    static readonly APPROVAL_SHEET_SUFFIX = "_ApprovalSheet";
    static readonly WALK_CYCLE_VARIANTS: readonly string[] = ["Walking", "Running", "Swimming", "Crouching"];
    static readonly SIDELOAD_SUFFIX = "_SideLoad";
    static readonly BLOCKBENCH_PROJECT_SUFFIX = "_BlockbenchProject";
    static readonly GIF_EXTENSION = "gif";
    static readonly PNG_EXTENSION = "png";
    static readonly JPG_EXTENSION = "jpg";
    static readonly PSD_EXTENSION = "psd";
    static readonly SIDELOAD_EXTENSION = "mcpack";
    static readonly BLOCKBENCH_PROJECT_EXTENSION = "bbmodel";
    static readonly STORE_FORMAT = "jpeg";
    static readonly MARKETING_FORMATS: readonly string[] = ["jpeg", "psd"];
    static readonly PERSONA_IMAGE_FORMAT = "png";
    static readonly PERSONA_PREVIEW_FORMAT = "gif";
    static readonly STORE_THUMBNAIL_WIDTH = 800;
    static readonly STORE_THUMBNAIL_HEIGHT = 450;
    static readonly STORE_SCREENSHOT_WIDTH = 800;
    static readonly STORE_SCREENSHOT_HEIGHT = 450;
    static readonly STORE_PANORAMA_HEIGHT = 450;
    static readonly STORE_PANORAMA_MIN_WIDTH = 1000;
    static readonly STORE_PANORAMA_MAX_WIDTH = 4000;
    static readonly STORE_PACK_ICON_SIZE = 256;
    static readonly MARKETING_WIDTH = 1920;
    static readonly MARKETING_HEIGHT = 1080;
    static readonly APPROVAL_SHEET_WIDTH = 5120;
    static readonly APPROVAL_SHEET_HEIGHT = 1600;
    static readonly STORE_DPI = 72;
    static readonly MARKETING_DPI = 300;
    static readonly DPI_TOLERANCE = 0.01;
    static readonly MARKETING_SCREENSHOT_MINIMUM = 5;
    static readonly STORE_SCREENSHOT_COUNT = 5;
    static readonly FIRST_INDEX = "0";
    private static readonly STANDARD_STEM = "[A-Za-z0-9]+";
    private static readonly PERSONA_STEM = "[A-Za-z0-9_.-]+";
    private static readonly EMOTE_STEM = "[a-z0-9_]+";
    private static readonly ANY_INDEX = "\\d+";
    private static readonly STORE_SCREENSHOT_INDEX = "[0-" + (ArtLimits.STORE_SCREENSHOT_COUNT - 1) + "]";
    private static readonly STANDARD_NAMES: ArtNamePatterns = {
        marketing: [
            ArtLimits.pattern(ArtLimits.STANDARD_STEM, ArtLimits.KEY_ART_SUFFIX, ArtLimits.JPG_EXTENSION, ArtLimits.PSD_EXTENSION),
            ArtLimits.pattern(ArtLimits.STANDARD_STEM, ArtLimits.PARTNER_ART_SUFFIX, ArtLimits.JPG_EXTENSION, ArtLimits.PSD_EXTENSION),
            ArtLimits.pattern(
                ArtLimits.STANDARD_STEM,
                ArtLimits.MARKETING_SCREENSHOT_SUFFIX + ArtLimits.ANY_INDEX,
                ArtLimits.JPG_EXTENSION,
                ArtLimits.PSD_EXTENSION
            ),
        ],
        store: [
            ArtLimits.pattern(ArtLimits.STANDARD_STEM, ArtLimits.THUMBNAIL_SUFFIX + ArtLimits.FIRST_INDEX, ArtLimits.JPG_EXTENSION),
            ArtLimits.pattern(
                ArtLimits.STANDARD_STEM,
                ArtLimits.STORE_SCREENSHOT_SUFFIX + ArtLimits.STORE_SCREENSHOT_INDEX,
                ArtLimits.JPG_EXTENSION
            ),
            ArtLimits.pattern(ArtLimits.STANDARD_STEM, ArtLimits.PANORAMA_SUFFIX + ArtLimits.FIRST_INDEX, ArtLimits.JPG_EXTENSION),
            ArtLimits.pattern(ArtLimits.STANDARD_STEM, ArtLimits.PACK_ICON_SUFFIX + ArtLimits.FIRST_INDEX, ArtLimits.JPG_EXTENSION),
        ],
    };
    private static readonly PERSONA_NAMES: ArtNamePatterns = {
        marketing: [
            ArtLimits.pattern(ArtLimits.PERSONA_STEM, ArtLimits.APPROVAL_SHEET_SUFFIX, ArtLimits.PNG_EXTENSION),
            ArtLimits.pattern(ArtLimits.PERSONA_STEM, "_(" + ArtLimits.WALK_CYCLE_VARIANTS.join("|") + ")", ArtLimits.GIF_EXTENSION),
            ArtLimits.pattern(ArtLimits.PERSONA_STEM, ArtLimits.SIDELOAD_SUFFIX, ArtLimits.SIDELOAD_EXTENSION),
            ArtLimits.pattern(ArtLimits.PERSONA_STEM, ArtLimits.BLOCKBENCH_PROJECT_SUFFIX, ArtLimits.BLOCKBENCH_PROJECT_EXTENSION),
        ],
        store: [ArtLimits.pattern(ArtLimits.PERSONA_STEM, ArtLimits.THUMBNAIL_SUFFIX + ArtLimits.FIRST_INDEX, ArtLimits.PNG_EXTENSION)],
    };
    private static readonly EMOTE_NAMES: ArtNamePatterns = {
        marketing: [
            ArtLimits.pattern(ArtLimits.EMOTE_STEM, "", ArtLimits.GIF_EXTENSION),
            ArtLimits.pattern(ArtLimits.EMOTE_STEM, ArtLimits.SIDELOAD_SUFFIX, ArtLimits.SIDELOAD_EXTENSION),
            ArtLimits.pattern(ArtLimits.EMOTE_STEM, ArtLimits.BLOCKBENCH_PROJECT_SUFFIX, ArtLimits.BLOCKBENCH_PROJECT_EXTENSION),
        ],
        store: [
            ArtLimits.pattern(
                ArtLimits.EMOTE_STEM,
                ArtLimits.THUMBNAIL_SUFFIX.toLowerCase() + ArtLimits.FIRST_INDEX,
                ArtLimits.PNG_EXTENSION
            ),
        ],
    };
    private static readonly NAMES_BY_KIND: Readonly<Record<ArtNameKind, ArtNamePatterns>> = {
        standard: ArtLimits.STANDARD_NAMES,
        persona: ArtLimits.PERSONA_NAMES,
        emote: ArtLimits.EMOTE_NAMES,
    };

    static namesFor(kind: ArtNameKind): ArtNamePatterns {
        return ArtLimits.NAMES_BY_KIND[kind];
    }

    private static pattern(nameWithoutExtension: string, suffix: string, ...extensions: readonly string[]): RegExp {
        return new RegExp("^" + nameWithoutExtension + suffix + "\\.(" + extensions.join("|") + ")$");
    }
}
