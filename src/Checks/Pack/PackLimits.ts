import type { ItemKind, PackType } from "../../Types/ModelTypes.js";
import TextureSuffixes from "../../Data/TextureSuffixes.js";
import ModelBuilder from "../../Model/ModelBuilder.js";

export default abstract class PackLimits {
    static readonly SIZE_LIMIT_MEGABYTES = 250;
    static readonly SIZE_LIMIT_BYTES = PackLimits.SIZE_LIMIT_MEGABYTES * 1_000_000;
    static readonly FILE_COUNT_LIMIT = 10000;
    static readonly FILE_OUTSIDE_PACK_FINDING_LIMIT = 5;
    static readonly MANIFEST_NAME = ModelBuilder.MANIFEST_NAME;
    static readonly SINGLE_PACK_FOLDERS: readonly string[] = ["skin_pack", "persona", "world_template"];
    static readonly PACK_CONTAINER_FOLDERS: readonly string[] = ModelBuilder.PACK_CONTAINER_FOLDERS.filter(
        (folder) => !PackLimits.SINGLE_PACK_FOLDERS.includes(folder)
    );
    static readonly SHARED_ADDON_EXTENSIONS: readonly string[] = [
        "json",
        "txt",
        "lang",
        "material",
        "mcfunction",
        "nbt",
        "png",
        "tga",
        "jpg",
        "jpeg",
        "hdr",
        "wav",
        "ogg",
        "fsb",
        "mcstructure",
    ];
    static readonly ALLOWED_EXTENSIONS: Readonly<Partial<Record<PackType, readonly string[]>>> = {
        behavior: [...PackLimits.SHARED_ADDON_EXTENSIONS, "js", "ts"],
        resource: PackLimits.SHARED_ADDON_EXTENSIONS,
        skin: ["json", "lang", "png", "tga", "jpg", "jpeg"],
        persona: ["json", "lang", "png", "tga"],
    };
    static readonly ASSET_FOLDERS: Readonly<Partial<Record<ItemKind, string>>> = { texture: "textures/", sound: "sounds/" };
    static readonly SHARED_ADDON_BLOCKED_PATHS: readonly string[] = [
        "font/emoticons.json",
        "credits/end.txt",
        "items_client.json",
        "items_offsets_clients.json",
        "texts/languages_names.json",
        "/shaders",
        "ui/mcoin.png",
        "contents.json",
        "signatures.json",
    ];
    static readonly BLOCKED_PATHS: Readonly<Partial<Record<PackType, readonly string[]>>> = {
        behavior: PackLimits.SHARED_ADDON_BLOCKED_PATHS,
        resource: PackLimits.SHARED_ADDON_BLOCKED_PATHS,
        skin: ["ui/mcoin.png", "/contents.json"],
        world_template: ["ui/mcoin.png", "/contents.json"],
    };
    static readonly PROTECTED_VANILLA_PATHS: Readonly<Partial<Record<PackType, readonly string[]>>> = {
        behavior: ["structures/sulfur_spring"],
    };
    static readonly EXPERIMENTAL_KINDS: readonly ItemKind[] = ["aim_assist_preset", "aim_assist_category", "behavior_tree", "spawn_group"];
    static readonly TEXTURE_SET_COMPANION_SUFFIXES: readonly string[] = TextureSuffixes.COMPANION;
    static readonly VANILLA_COPY_EXEMPT_PATHS: readonly string[] = ["texts/languages.json"];
    static readonly PARTIAL_COPY_EXTENSIONS: readonly string[] = ["json", "material"];
    static readonly PARTIAL_COPY_FILE_NAMES: readonly string[] = [
        "mobs.json",
        "sound_definitions.json",
        "item_texture.json",
        "terrain_texture.json",
        "blocks.json",
    ];
    static readonly PARTIAL_COPY_FOLDERS: readonly string[] = ["ui/", "materials/"];
    static readonly PARTIAL_COPY_EXEMPT_PROPERTIES: readonly string[] = [
        "format_version",
        "namespace",
        "resource_pack_name",
        "texture_name",
        "padding",
        "num_mip_levels",
    ];
}
