import type { ItemKind } from "../../Types/ModelTypes.js";
import BlockCatalogLoader from "../../Loaders/BlockCatalogLoader.js";

export default abstract class BlockLimits {
    static readonly CATALOG_KINDS: readonly ItemKind[] = BlockCatalogLoader.CATALOG_KINDS;
    static readonly DEPRECATED_OVERRIDE_KEYS: readonly string[] = ["fletching_table", "smithing_table"];
}
