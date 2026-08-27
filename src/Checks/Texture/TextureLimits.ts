import type { ContentType } from "../../Types/CheckTypes.js";
import type { TierLimitTable } from "../../Types/TextureTypes.js";
import TextureFormat from "../../Loaders/TextureFormat.js";
import TextureHandleLoader from "../../Loaders/TextureHandleLoader.js";
import ManifestLimits from "../Manifest/ManifestLimits.js";

export default abstract class TextureLimits {
    static readonly NON_ATLAS_TEXTURE_LIMIT = 2048 * 2048 * TextureFormat.BYTES_PER_TEXEL;
    static readonly ATLAS_TEXTURE_LIMIT = 256 * 256 * TextureFormat.BYTES_PER_TEXEL;
    static readonly MIP_LIMIT = 4 * TextureFormat.MEBIBYTE;
    static readonly ATLAS_TOTAL_RECOMMENDED = 4096 * 4096 * TextureFormat.BYTES_PER_TEXEL;
    static readonly ATLAS_TOTAL_LIMIT = 4 * TextureLimits.ATLAS_TOTAL_RECOMMENDED;
    static readonly HIGHEST_TIER = TextureFormat.HIGHEST_TIER;
    static readonly LOW_TIER_MAXIMUM = 1;
    static readonly VIBRANT_VISUALS_TIER = 2;
    static readonly OVERLAP_MINIMUM_TIER = 2;
    static readonly BASE_OVERLAP_PERCENT = 80;
    static readonly TIER_LIMITS_MEBIBYTES: Readonly<Record<TierLimitTable, readonly number[]>> = {
        addon: [150, 150, 225, 300, 600, 800],
        texture: [350, 350, 500, 650, 1250, 1650],
        world: [750, 750, 1000, 1500, 3000, 4000],
    };
    static readonly PBR_CAPABILITY = ManifestLimits.PBR_CAPABILITY;
    static readonly BLOCK_ATLAS_PREFIX = TextureHandleLoader.BLOCK_ATLAS_PREFIX;
    static readonly ENTITY_PREFIX = "textures/entity/";
    static readonly TEXTURE_SET_SUFFIX = ".texture_set.json";
    static readonly TEXTURE_SET_ROOT = TextureFormat.TEXTURE_SET_ROOT;
    static readonly DEPRECATED_BLOCK_TEXTURES: readonly string[] = [
        "smithing_table_top",
        "smithing_table_side1",
        "smithing_table_side2",
        "fletcher_table_top",
        "fletcher_table_side1",
        "fletcher_table_side2",
    ];
    static readonly DEPRECATED_TERRAIN_ENTRIES: readonly string[] = [
        "smithing_table_top",
        "smithing_table_side_a",
        "smithing_table_side_b",
        "fletching_table_top",
        "fletching_table_side1",
        "fletching_table_side2",
    ];

    static tableFor(contentType: ContentType): TierLimitTable {
        if (contentType === "texture") {
            return "texture";
        }

        if (contentType === "world") {
            return "world";
        }

        return "addon";
    }

    static tierLimitBytes(contentType: ContentType, tier: number): number {
        return TextureLimits.TIER_LIMITS_MEBIBYTES[TextureLimits.tableFor(contentType)][tier] * TextureFormat.MEBIBYTE;
    }

    static formatBytes(bytes: number): string {
        if (bytes < TextureFormat.MEBIBYTE) {
            return TextureLimits.formatNumber(bytes / TextureFormat.KIBIBYTE) + " KiB";
        }

        return TextureLimits.formatMebibytes(bytes);
    }

    static formatMebibytes(bytes: number): string {
        return TextureLimits.formatNumber(bytes / TextureFormat.MEBIBYTE) + " MiB";
    }

    private static formatNumber(value: number): string {
        return Number.isInteger(value) ? String(value) : value.toFixed(2);
    }
}
