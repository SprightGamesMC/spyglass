import type { GameVersion } from "../../Types/LoaderTypes.js";
import type { ItemKind, PackType } from "../../Types/ModelTypes.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import TextureFormat from "../../Loaders/TextureFormat.js";

export default abstract class ManifestLimits {
    static readonly FORMAT_VERSION_2 = 2;
    static readonly FORMAT_VERSION_3 = 3;
    static readonly VALID_FORMAT_VERSIONS: readonly number[] = [1, 2, 3];
    static readonly FORMAT_1_MIN_ENGINE_VERSION_LIMIT: GameVersion = { major: 1, minor: 13, patch: 0 };
    static readonly FORMAT_1_MIN_ENGINE_VERSION_LIMIT_EDUCATION: GameVersion = { major: 1, minor: 15, patch: 0 };
    static readonly PBR_MIN_ENGINE_VERSION: GameVersion = { major: 1, minor: 21, patch: 120 };
    static readonly PBR_CAPABILITY = "pbr";
    static readonly ALLOWED_CAPABILITIES: readonly string[] = [ManifestLimits.PBR_CAPABILITY];
    static readonly PACK_SCOPES: readonly string[] = ["global", "world", "any"];
    static readonly WORLD_TEMPLATE_MODULE_TYPE = "world_template";
    static readonly KNOWN_MODULE_TYPES: readonly string[] = [
        "persona_piece",
        ManifestLimits.WORLD_TEMPLATE_MODULE_TYPE,
        "skin_pack",
        "data",
        "script",
        "resources",
    ];
    static readonly ALLOWED_DEPENDENCY_MODULES: Readonly<Record<string, GameVersion>> = {
        "@minecraft/server": { major: 1, minor: 0, patch: 0 },
        "@minecraft/server-ui": { major: 1, minor: 0, patch: 0 },
    };
    static readonly SCRIPT_MODULE_UUIDS: Readonly<Record<string, string>> = {
        "77ec12b4-1b2b-4c98-8d34-d1cd63f849d5": "@minecraft/common",
        "1796ea86-0daf-4409-99ee-fd6467cf1203": "@minecraft/debug-utilities",
        "b26a4d4c-afdf-4690-88f8-931846312678": "@minecraft/server",
        "53d7f2bf-bf9c-49c4-ad1f-7c803d947920": "@minecraft/server-admin",
        "1d565354-296d-11ed-a261-0242ac120002": "@minecraft/server-editor",
        "8518d9c7-a1f5-4bf3-acc7-78e87df595fc": "@minecraft/server-editor-bindings",
        "6f4b6893-1bb6-42fd-b458-7fa3d0c89616": "@minecraft/server-gametest",
        "777b1798-13a6-401c-9cba-0cf17e31a81b": "@minecraft/server-net",
        "2bd50a27-ab5f-4f40-a596-3641627c635e": "@minecraft/server-ui",
    };
    static readonly KNOWN_SETTING_TYPES: readonly string[] = ["label", "toggle", "slider", "dropdown"];
    static readonly SETTING_REQUIRED_FIELDS: Readonly<Record<string, readonly string[]>> = {
        toggle: ["name", "default"],
        slider: ["name", "min", "max", "step", "default"],
        dropdown: ["name", "default", "options"],
    };
    static readonly DROPDOWN_MIN_OPTIONS = 2;
    static readonly NAMESPACE_PATTERN = /^.+:.+$/;
    static readonly PACK_ICON_KINDS: readonly ItemKind[] = ["pack_icon"];
    static readonly PACK_ICON_SIDES: readonly number[] = [2, 4, 8, 16, 32, 64, 128, 256];
    static readonly PACK_ICON_MIN_SIDE = ManifestLimits.PACK_ICON_SIDES[0];
    static readonly PACK_ICON_MAX_SIDE = ManifestLimits.PACK_ICON_SIDES[ManifestLimits.PACK_ICON_SIDES.length - 1];
    static readonly VIBRANT_VISUALS_LAYERS: readonly string[] = [
        "metalness_emissive_roughness",
        "metalness_emissive_roughness_subsurface",
        "normal",
        "heightmap",
    ];
    static readonly TEXTURE_SET_KEY = TextureFormat.TEXTURE_SET_ROOT;
    static readonly FORMAT_1_RESTRICTED_PACK_TYPES: readonly PackType[] = ["behavior", "resource", "world_template"];
    static readonly PACK_ICON_EXEMPT_PACK_TYPES: readonly PackType[] = ["skin", "persona", "world_template"];
    static readonly MIN_ENGINE_VERSION_PACK_TYPES: readonly PackType[] = PackItemLoader.CONTENT_PACK_TYPES;
    static readonly DEPENDENCY_CHECKED_PACK_TYPES: readonly PackType[] = PackItemLoader.CONTENT_PACK_TYPES;
}
