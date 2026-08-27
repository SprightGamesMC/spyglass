import type { FileEntry, Storage } from "./StorageTypes.js";

export type PackType = "behavior" | "resource" | "skin" | "world_template" | "persona" | "unknown";

export type ItemKind =
    | "manifest"
    | "pack_icon"
    | "contents_json"
    | "signatures_json"
    | "languages"
    | "language_names"
    | "lang"
    | "entity_behavior"
    | "entity_resource"
    | "item_behavior"
    | "item_resource"
    | "block_behavior"
    | "blocks_catalog"
    | "attachable"
    | "particle"
    | "recipe"
    | "spawn_rule"
    | "fog"
    | "atmospherics"
    | "color_grading"
    | "lighting"
    | "local_lighting"
    | "pbr_settings"
    | "point_lights"
    | "shadows"
    | "water"
    | "biomes_client"
    | "biome_behavior"
    | "biome_resource"
    | "feature"
    | "feature_rule"
    | "loot_table"
    | "trade_table"
    | "function"
    | "tick_json"
    | "structure"
    | "script"
    | "dialogue"
    | "camera_preset"
    | "aim_assist_preset"
    | "aim_assist_category"
    | "block_culling_rule"
    | "jigsaw_structure"
    | "template_pool"
    | "structure_set"
    | "processor_list"
    | "behavior_tree"
    | "spawn_group"
    | "crafting_item_catalog"
    | "animation_behavior"
    | "animation_controller_behavior"
    | "animation_resource"
    | "animation_controller_resource"
    | "render_controller"
    | "geometry"
    | "material"
    | "ui"
    | "font"
    | "texture"
    | "texture_set"
    | "terrain_texture"
    | "item_texture"
    | "flipbook_textures"
    | "texture_list"
    | "sound_definitions"
    | "sounds_json"
    | "music_definitions"
    | "sound"
    | "skins"
    | "persona_meta"
    | "persona_geometry"
    | "persona_animation"
    | "world_behavior_packs"
    | "world_resource_packs"
    | "level_dat"
    | "level_dat_old"
    | "levelname"
    | "world_icon"
    | "database"
    | "education"
    | "splashes"
    | "loading_messages"
    | "text"
    | "json_unknown"
    | "other";

export interface ContentItem {
    readonly kind: ItemKind;
    readonly path: string;
    readonly packPath: string;
    readonly size: number;
}

export interface Pack {
    readonly root: string;
    readonly type: PackType;
    readonly manifestPath: string;
    readonly items: readonly ContentItem[];
}

export interface World {
    readonly root: string;
    readonly items: readonly ContentItem[];
    readonly packs: readonly Pack[];
}

export type ArtFolder = "Marketing Art" | "Store Art";

export interface ArtFile {
    readonly folder: ArtFolder;
    readonly path: string;
    readonly name: string;
    readonly size: number;
}

export interface ContentModel {
    readonly storage: Storage;
    readonly packs: readonly Pack[];
    readonly worlds: readonly World[];
    readonly filesOutsidePacks: readonly FileEntry[];
    readonly art: readonly ArtFile[];
    readonly allFiles: readonly FileEntry[];
}
