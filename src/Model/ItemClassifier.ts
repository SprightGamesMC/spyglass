import type { ItemKind, PackType } from "../Types/ModelTypes.js";
import ImageMetadataReader from "../Loaders/ImageMetadataReader.js";
import LanguageCatalogReader from "../Loaders/LanguageCatalogReader.js";
import PackItemLoader from "../Loaders/PackItemLoader.js";
import PersonaFormat from "../Loaders/PersonaFormat.js";
import SoundFormat from "../Loaders/SoundFormat.js";
import SubpackFormat from "../Loaders/SubpackFormat.js";
import TextureFormat from "../Loaders/TextureFormat.js";
import PathUtilities from "../Storage/PathUtilities.js";

export default abstract class ItemClassifier {
    private static readonly SCRIPT_EXTENSIONS: readonly string[] = ["js", "ts", "mjs"];
    private static readonly TEXTURE_LIST_PREFIXES: readonly string[] = ["texture_list", "textures_list"];
    private static readonly UI_TEXTURE_FOLDER = TextureFormat.TEXTURE_FOLDER + "ui/";
    private static readonly ROOT_NAMES: Readonly<Record<string, ItemKind>> = {
        "contents.json": "contents_json",
        "signatures.json": "signatures_json",
        "blocks.json": "blocks_catalog",
        "sounds.json": "sounds_json",
        "biomes_client.json": "biomes_client",
        "skins.json": "skins",
        "splashes.json": "splashes",
        "loading_messages.json": "loading_messages",
        "world_behavior_packs.json": "world_behavior_packs",
        "world_resource_packs.json": "world_resource_packs",
        "level.dat": "level_dat",
        "level.dat_old": "level_dat_old",
        "levelname.txt": "levelname",
    };
    private static readonly BEHAVIOR_FOLDERS: Readonly<Record<string, ItemKind>> = {
        entities: "entity_behavior",
        items: "item_behavior",
        blocks: "block_behavior",
        recipes: "recipe",
        spawn_rules: "spawn_rule",
        biomes: "biome_behavior",
        features: "feature",
        feature_rules: "feature_rule",
        loot_tables: "loot_table",
        trading: "trade_table",
        animations: "animation_behavior",
        animation_controllers: "animation_controller_behavior",
        dialogue: "dialogue",
        cameras: "camera_preset",
        block_culling: "block_culling_rule",
        behavior_trees: "behavior_tree",
        spawn_groups: "spawn_group",
        item_catalog: "crafting_item_catalog",
        structures: "structure",
        functions: "function",
        scripts: "script",
    };
    private static readonly RESOURCE_FOLDERS: Readonly<Record<string, ItemKind>> = {
        entity: "entity_resource",
        attachables: "attachable",
        particles: "particle",
        fogs: "fog",
        atmospherics: "atmospherics",
        color_grading: "color_grading",
        lighting: "lighting",
        local_lighting: "local_lighting",
        pbr: "pbr_settings",
        point_lights: "point_lights",
        shadows: "shadows",
        water: "water",
        biomes: "biome_resource",
        animations: "animation_resource",
        animation_controllers: "animation_controller_resource",
        render_controllers: "render_controller",
        models: "geometry",
        materials: "material",
        ui: "ui",
        font: "font",
        items: "item_resource",
        block_culling: "block_culling_rule",
        cameras: "camera_preset",
    };

    static classify(packType: PackType, packPath: string): ItemKind {
        if (SubpackFormat.folderName(packPath) !== undefined) {
            return ItemClassifier.classify(packType, SubpackFormat.pathWithoutSubpack(packPath));
        }

        const name = PathUtilities.fileName(packPath).toLowerCase();
        const extension = PathUtilities.extension(packPath);
        const firstFolder = PathUtilities.segments(packPath).length > 1 ? PathUtilities.firstSegment(packPath).toLowerCase() : "";
        const lowerPath = packPath.toLowerCase();

        if (name === "manifest.json" && firstFolder === "") {
            return "manifest";
        }

        if (name.includes("pack_icon") && extension === "png") {
            return "pack_icon";
        }

        const rootKind = ItemClassifier.classifyRootFile(name, firstFolder);

        if (rootKind !== undefined) {
            return rootKind;
        }

        if (firstFolder === LanguageCatalogReader.TEXTS_FOLDER) {
            return ItemClassifier.classifyText(name, extension);
        }

        if (firstFolder === "db") {
            return "database";
        }

        if (packType === PackItemLoader.PERSONA_PACK_TYPE) {
            return ItemClassifier.classifyPersona(name, extension);
        }

        if (packType === PackItemLoader.SKIN_PACK_TYPE) {
            return ItemClassifier.classifySkin(name, extension);
        }

        if (packType === PackItemLoader.WORLD_TEMPLATE_PACK_TYPE) {
            return ItemClassifier.classifyWorldFile(name, extension);
        }

        const catalogKind = ItemClassifier.classifyCatalog(lowerPath, name);

        if (catalogKind !== undefined) {
            return catalogKind;
        }

        const byExtension = ItemClassifier.classifyByExtension(extension, firstFolder);

        if (byExtension !== undefined) {
            return byExtension;
        }

        if (extension !== "json") {
            return "other";
        }

        return ItemClassifier.classifyJsonByFolder(packType, firstFolder, lowerPath);
    }

    private static isSound(extension: string): boolean {
        return SoundFormat.FILE_EXTENSIONS.includes(extension);
    }

    private static isImage(extension: string): boolean {
        return ImageMetadataReader.IMAGE_EXTENSIONS.includes(extension);
    }

    private static isTextureListName(name: string): boolean {
        return name.endsWith(".json") && ItemClassifier.TEXTURE_LIST_PREFIXES.some((prefix) => name.startsWith(prefix));
    }

    private static classifyRootFile(name: string, firstFolder: string): ItemKind | undefined {
        if (firstFolder !== "") {
            return undefined;
        }

        if (ItemClassifier.ROOT_NAMES[name] !== undefined) {
            return ItemClassifier.ROOT_NAMES[name];
        }

        if (name.includes("world_icon") && (name.endsWith(".jpeg") || name.endsWith(".jpg"))) {
            return "world_icon";
        }

        if (ItemClassifier.isTextureListName(name)) {
            return "texture_list";
        }

        return undefined;
    }

    private static classifyText(name: string, extension: string): ItemKind {
        if (name === LanguageCatalogReader.LANGUAGES_FILE) {
            return "languages";
        }

        if (LanguageCatalogReader.LANGUAGE_NAMES_FILES.includes(name)) {
            return "language_names";
        }

        if (extension === "lang") {
            return "lang";
        }

        return extension === "json" ? "json_unknown" : "text";
    }

    private static classifyPersona(name: string, extension: string): ItemKind {
        if (name.endsWith(PersonaFormat.META_SUFFIX)) {
            return "persona_meta";
        }

        if (name.endsWith(PersonaFormat.GEOMETRY_SUFFIX) || name.endsWith(PersonaFormat.SHORT_GEOMETRY_SUFFIX)) {
            return "persona_geometry";
        }

        if (name.endsWith(PersonaFormat.ANIMATION_SUFFIX)) {
            return "persona_animation";
        }

        if (ItemClassifier.isImage(extension)) {
            return "texture";
        }

        return extension === "json" ? "json_unknown" : "other";
    }

    private static classifySkin(name: string, extension: string): ItemKind {
        if (name.endsWith(".geometry.json") || name === "geometry.json") {
            return "geometry";
        }

        if (ItemClassifier.isImage(extension)) {
            return "texture";
        }

        return extension === "json" ? "json_unknown" : "other";
    }

    private static classifyWorldFile(name: string, extension: string): ItemKind {
        if (name.endsWith(".mcstructure")) {
            return "structure";
        }

        if (extension === "json" && name.includes("education")) {
            return "education";
        }

        return extension === "json" ? "json_unknown" : "other";
    }

    private static classifyCatalog(lowerPath: string, name: string): ItemKind | undefined {
        if (lowerPath === TextureFormat.TERRAIN_TEXTURE_PATH) {
            return "terrain_texture";
        }

        if (lowerPath === TextureFormat.ITEM_TEXTURE_PATH) {
            return "item_texture";
        }

        if (lowerPath === "textures/flipbook_textures.json") {
            return "flipbook_textures";
        }

        if (lowerPath.startsWith(TextureFormat.TEXTURE_FOLDER) && ItemClassifier.isTextureListName(name)) {
            return "texture_list";
        }

        if (lowerPath.startsWith(ItemClassifier.UI_TEXTURE_FOLDER) && name.endsWith(".json")) {
            return "ui";
        }

        if (lowerPath === "sounds/sound_definitions.json") {
            return "sound_definitions";
        }

        if (lowerPath === "sounds/music_definitions.json") {
            return "music_definitions";
        }

        if (lowerPath === "functions/tick.json") {
            return "tick_json";
        }

        if (name.endsWith(".texture_set.json")) {
            return "texture_set";
        }

        if (name.endsWith(".mcstructure")) {
            return "structure";
        }

        return undefined;
    }

    private static classifyByExtension(extension: string, firstFolder: string): ItemKind | undefined {
        if (ItemClassifier.isImage(extension)) {
            return "texture";
        }

        if (ItemClassifier.isSound(extension)) {
            return "sound";
        }

        if (extension === "mcfunction") {
            return "function";
        }

        if (ItemClassifier.SCRIPT_EXTENSIONS.includes(extension)) {
            return "script";
        }

        if (extension === "material") {
            return "material";
        }

        if (extension === "lang") {
            return "lang";
        }

        if (extension === "json" && firstFolder === "scripts") {
            return "script";
        }

        return undefined;
    }

    private static classifyJsonByFolder(packType: PackType, firstFolder: string, lowerPath: string): ItemKind {
        if (packType === PackItemLoader.BEHAVIOR_PACK_TYPE) {
            return ItemClassifier.classifyBehaviorJson(firstFolder, lowerPath);
        }

        if (packType === PackItemLoader.RESOURCE_PACK_TYPE) {
            return ItemClassifier.RESOURCE_FOLDERS[firstFolder] ?? "json_unknown";
        }

        return "json_unknown";
    }

    private static classifyBehaviorJson(firstFolder: string, lowerPath: string): ItemKind {
        if (firstFolder === "aim_assist") {
            return lowerPath.includes("/categories/") ? "aim_assist_category" : "aim_assist_preset";
        }

        if (firstFolder === "worldgen") {
            return ItemClassifier.classifyWorldgenJson(lowerPath);
        }

        return ItemClassifier.BEHAVIOR_FOLDERS[firstFolder] ?? "json_unknown";
    }

    private static classifyWorldgenJson(lowerPath: string): ItemKind {
        if (lowerPath.includes("/template_pools/")) {
            return "template_pool";
        }

        if (lowerPath.includes("/structure_sets/")) {
            return "structure_set";
        }

        if (lowerPath.includes("/processors/")) {
            return "processor_list";
        }

        return "jigsaw_structure";
    }
}
