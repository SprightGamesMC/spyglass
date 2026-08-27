import type { PackType } from "../../Types/ModelTypes.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";

export default abstract class WorldLimits {
    static readonly PACK_TYPE: PackType = PackItemLoader.WORLD_TEMPLATE_PACK_TYPE;
    static readonly ICON_WIDTH = 800;
    static readonly ICON_HEIGHT = 450;
    static readonly EDUCATION_ICON_WIDTH = 480;
    static readonly EDUCATION_ICON_HEIGHT = 270;
    static readonly ICON_EXTENSION = "jpeg";
    static readonly ICON_NAME_PART = "world_icon";
    static readonly TEXTURE_HANDLE_LIMIT = 3000;
    static readonly MASHUP_COVERAGE_MINIMUM_PERCENT = 60;
    static readonly LOCK_TEMPLATE_OPTIONS_FORMAT_VERSION = 2;
    static readonly BASE_GAME_VERSION_WILDCARD = "*";
    static readonly PACK_REFERENCE_VERSION_LENGTH = 3;
    static readonly EXPERIMENTS_COMPOUND = "experiments";
    static readonly EXPERIMENTAL_GAMEPLAY = "experimentalgameplay";
    static readonly EXPERIMENT_IGNORED_KEYS: readonly string[] = ["saved_with_toggled_experiments"];
}
