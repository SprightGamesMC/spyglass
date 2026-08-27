import type { GameVersion } from "../../Types/LoaderTypes.js";
import type { ItemKind, PackType } from "../../Types/ModelTypes.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";

export default abstract class ScriptLimits {
    static readonly PACK_TYPE: PackType = PackItemLoader.BEHAVIOR_PACK_TYPE;
    static readonly BETA_VERSION_MARKER = "-beta";
    static readonly FUNCTION_ENGINE_VERSION: GameVersion = { major: 1, minor: 8, patch: 0 };
    static readonly USE_BETA_FEATURES_KEY = "use_beta_features";
    static readonly BETA_FEATURE_FILE_KINDS: readonly ItemKind[] = ["entity_behavior", "block_behavior", "item_behavior"];
}
