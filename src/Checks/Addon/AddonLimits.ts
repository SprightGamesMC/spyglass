export default abstract class AddonLimits {
    static readonly SIZE_LIMIT_MEGABYTES = 25;
    static readonly SIZE_LIMIT_BYTES = AddonLimits.SIZE_LIMIT_MEGABYTES * 1_000_000;
    static readonly FILE_COUNT_LIMIT = 3500;
    static readonly TEXTURE_HANDLE_LIMIT = 800;
    static readonly BASE_TEXTURE_MEMORY_LIMIT_MEBIBYTES = 150;
    static readonly BASE_TEXTURE_MEMORY_LIMIT_BYTES = AddonLimits.BASE_TEXTURE_MEMORY_LIMIT_MEBIBYTES * 1024 * 1024;
    static readonly NAMESPACE_TOKEN_MINIMUM_LENGTH = 2;
    static readonly MATERIAL_TOKEN_MINIMUM_COUNT = 3;
    static readonly UNIQUE_FORM = /^[a-z0-9]{2,}_[a-z0-9]{2,}$/i;
    static readonly EXPECTED_RESOURCE_PACK_SCOPE = "world";
    static readonly BASE_TIER = 0;
    static readonly COMMON_FOLDER = "common";
    static readonly STRUCTURES_FOLDER = "structures";
    static readonly UI_FOLDER = "ui";
    static readonly MATERIAL_VERSION_KEY = "version";
    static readonly VANILLA_OVERRIDE_ALLOWED_PATHS: readonly string[] = [
        "manifest.json",
        "pack_icon.png",
        "texts/languages.json",
        "sounds.json",
        "blocks.json",
        "biomes_client.json",
        "sounds/sound_definitions.json",
        "sounds/music_definitions.json",
        "textures/terrain_texture.json",
        "textures/item_texture.json",
        "textures/flipbook_textures.json",
        "textures/texture_list.json",
        "textures/textures_list.json",
        "lighting/global.json",
        "water/water.json",
        "atmospherics/atmospherics.json",
        "color_grading/color_grading.json",
    ];
    static readonly VANILLA_OVERRIDE_ALLOWED_FOLDERS: readonly string[] = [
        "materials",
        "local_lighting",
        "pbr",
        "point_lights",
        "shadows",
        "ui",
    ];
    static readonly VANILLA_OVERRIDE_ALLOWED_EXTENSIONS: readonly string[] = ["lang"];
    static readonly VANILLA_DIMENSION_NAMES: Readonly<Record<number, string>> = { 0: "Overworld", 1: "Nether", 2: "The End" };
    static readonly NAMESPACED_PATH_FOLDERS: readonly string[] = [
        "functions",
        "loot_tables",
        "trading",
        "trade_tables",
        "textures",
        "sounds",
        "structures",
    ];
    static readonly BEHAVIOR_UNSCANNED_FOLDERS: readonly string[] = [
        "texts",
        "entities",
        "features",
        "feature_rules",
        "particles",
        "items",
        "scripts",
        "recipes",
        "spawn_rules",
        "animations",
        "animation_controllers",
        "render_controllers",
        "blocks",
        "biomes",
        "dialogue",
        "cameras",
        "aim_assist",
        "block_culling",
        "worldgen",
        "behavior_trees",
        "spawn_groups",
        "item_catalog",
    ];
    static readonly RESOURCE_UNSCANNED_FOLDERS: readonly string[] = [
        "texts",
        "entity",
        "items",
        "particles",
        "materials",
        "blocks",
        "models",
        "attachables",
        "render_controllers",
        "animation_controllers",
        "animations",
        "biomes",
        "fogs",
        "atmospherics",
        "color_grading",
        "lighting",
        "local_lighting",
        "pbr",
        "point_lights",
        "shadows",
        "water",
        "block_culling",
        "cameras",
    ];
    static readonly CATALOG_FILES: Readonly<Record<string, readonly string[]>> = {
        functions: ["tick.json"],
        textures: [
            "flipbook_textures.json",
            "item_texture.json",
            "item_textures.json",
            "terrain_texture.json",
            "terrain_textures.json",
            "texture_list.json",
            "textures_list.json",
            "blocks.json",
            "block.json",
        ],
        item_catalog: ["crafting_item_catalog.json"],
        sounds: ["sound_definitions.json", "sounds.json", "music_definitions.json"],
    };
    static readonly CATALOG_KEY_TOKEN_MINIMUM_COUNT = 3;
}
