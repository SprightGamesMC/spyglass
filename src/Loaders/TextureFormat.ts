import PathUtilities from "../Storage/PathUtilities.js";
import SubpackFormat from "./SubpackFormat.js";

export default abstract class TextureFormat {
    static readonly BYTES_PER_TEXEL = 4;
    static readonly KIBIBYTE = 1024;
    static readonly MEBIBYTE = TextureFormat.KIBIBYTE * TextureFormat.KIBIBYTE;
    static readonly TIER_COUNT = 6;
    static readonly HIGHEST_TIER = TextureFormat.TIER_COUNT - 1;
    static readonly MEMORY_TIER_UPPER_BOUNDS: readonly number[] = [10, 11, 12, 18, 31];
    static readonly TEXTURE_FOLDER = "textures/";
    static readonly TERRAIN_TEXTURE_PATH = "textures/terrain_texture.json";
    static readonly ITEM_TEXTURE_PATH = "textures/item_texture.json";
    static readonly TEXTURE_SET_ROOT = "minecraft:texture_set";
    static readonly COMPANION_LAYERS: readonly string[] = [
        "metalness_emissive_roughness",
        "metalness_emissive_roughness_subsurface",
        "normal",
        "heightmap",
    ];
    static readonly MER_LAYERS: readonly string[] = ["metalness_emissive_roughness", "metalness_emissive_roughness_subsurface"];
    static readonly TEXTURE_SET_LAYERS: readonly string[] = ["color", ...TextureFormat.COMPANION_LAYERS];
    static readonly COLOR_PREFIX = "#";
    static readonly ENGINE_ATLAS_PREFIX = "atlas.";

    static isColorLiteral(reference: string): boolean {
        return reference.trim().startsWith(TextureFormat.COLOR_PREFIX);
    }

    static isEngineAtlas(reference: string): boolean {
        return reference.trim().toLowerCase().startsWith(TextureFormat.ENGINE_ATLAS_PREFIX);
    }

    static isTexturePath(text: string): boolean {
        return text.toLowerCase().startsWith(TextureFormat.TEXTURE_FOLDER);
    }

    static resolveTextureSetLayer(textureSetPackPath: string, reference: string): string | undefined {
        const normalized = PathUtilities.normalize(reference.trim());

        if (normalized.includes("/")) {
            return PathUtilities.normalizeReference(normalized);
        }

        const folder = PathUtilities.directory(SubpackFormat.pathWithoutSubpack(textureSetPackPath));

        return PathUtilities.normalizeReference(PathUtilities.join(folder, normalized));
    }
}
