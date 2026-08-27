import LanguageCatalogReader from "../../Loaders/LanguageCatalogReader.js";

export default abstract class SkinLimits {
    static readonly SKIN_COUNT_LIMIT = 80;
    static readonly SKIN_COUNT_MINIMUM = 5;
    static readonly FREE_SKIN_COUNT_LIMIT = 2;
    static readonly ENGLISH_LANG_FILE = LanguageCatalogReader.PRIMARY_LANG_FILE;
    static readonly PACK_ICON_PREFIX = "pack_icon";
    static readonly FREE_PURCHASE_TYPE = "free";
    static readonly EDGE_WHITESPACE = /^\s|\s$/;
    static readonly SKIN_NAME_FORBIDDEN = /[0-9_]/;
    static readonly ALLOWED_PURCHASE_TYPES: readonly string[] = ["free", "paid"];
    static readonly ALLOWED_GEOMETRIES: readonly string[] = ["geometry.humanoid.custom", "geometry.humanoid.customSlim"];
    static readonly MODEL_MARKERS: readonly string[] = ["a", "alex", "slim", "customslim", "s", "steve", "custom"];
    static readonly SKIN_TEXTURE_SIZES: readonly (readonly [number, number])[] = [
        [64, 64],
        [64, 32],
        [128, 128],
    ];
    static readonly CAPE_TEXTURE_SIZES: readonly (readonly [number, number])[] = [[64, 32]];
}
