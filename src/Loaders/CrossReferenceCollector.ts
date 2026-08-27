import type { LinkCollection, LinkKind } from "../Types/CrossReferenceTypes.js";
import type { JsonObject, JsonValue } from "../Types/LoaderTypes.js";
import type { ContentItem, Pack } from "../Types/ModelTypes.js";
import JsonKeys from "../Data/JsonKeys.js";
import BlockSchema from "../Data/Schemas/BlockSchema.js";
import EntitySchema from "../Data/Schemas/EntitySchema.js";
import ItemSchema from "../Data/Schemas/ItemSchema.js";
import SpawnRuleSchema from "../Data/Schemas/SpawnRuleSchema.js";
import PathUtilities from "../Storage/PathUtilities.js";
import GeometryReader from "./GeometryReader.js";
import JsonLoader from "./JsonLoader.js";
import TextureFormat from "./TextureFormat.js";

export default class CrossReferenceCollector {
    private static readonly TEXTURE_PREFIX_LITERAL = /'(textures\/[^']*)'/g;
    private static readonly TEXTURE_PREFIX_MARKER = "'textures/";
    private static readonly RECIPE_ITEM_KEYS: readonly string[] = ["item", "input", "output", "result", "reagent"];
    private static readonly SOUND_EVENT_CONTAINER_KEYS: readonly string[] = ["events", "default"];
    private static readonly TAG_PREFIX = "#";
    private static readonly BLOCK_LINK_KIND: LinkKind = "item";

    private readonly pack: Pack;
    private readonly item: ContentItem;
    private readonly value: JsonValue | undefined;
    private readonly output: LinkCollection;

    constructor(pack: Pack, item: ContentItem, value: JsonValue | undefined, output: LinkCollection) {
        this.pack = pack;
        this.item = item;
        this.value = value;
        this.output = output;
    }

    collect(): void {
        switch (this.item.kind) {
            case "geometry":
                return this.collectGeometry();
            case "entity_resource":
                return this.collectClientEntity();
            case "attachable":
                return this.collectAttachable();
            case "particle":
                return this.collectParticle();
            case "item_texture":
            case "terrain_texture":
                return this.collectAtlas();
            case "flipbook_textures":
                return this.collectFlipbook();
            case "ui":
                return this.collectUi();
            case "texture_set":
                return this.collectTextureSet();
            case "animation_resource":
            case "animation_behavior":
                return this.collectAnimations();
            case "animation_controller_resource":
            case "animation_controller_behavior":
                return this.collectAnimationControllers();
            case "render_controller":
                return this.defineKeys("render_controller", JsonLoader.get(this.value, "render_controllers"));
            case "sound_definitions":
                return this.collectSoundDefinitions();
            case "sounds_json":
                return this.collectSoundEvents(this.value, "");
            case "entity_behavior":
                return this.collectServerEntity();
            case "spawn_rule":
                return this.reference(
                    "entity",
                    JsonLoader.get(this.value, SpawnRuleSchema.ROOT_KEY, "description", "identifier"),
                    "description.identifier"
                );
            case "item_behavior":
                return this.define("item", JsonLoader.get(this.value, ItemSchema.ROOT_KEY, "description", "identifier"));
            case "block_behavior":
                return this.define(
                    CrossReferenceCollector.BLOCK_LINK_KIND,
                    JsonLoader.get(this.value, BlockSchema.ROOT_KEY, "description", "identifier")
                );
            case "recipe":
                return this.collectRecipe(this.value, "");
            default:
                return;
        }
    }

    private collectGeometry(): void {
        const geometries = JsonLoader.get(this.value, GeometryReader.GEOMETRY_KEY);

        if (JsonLoader.isArray(geometries)) {
            for (const entry of geometries) {
                this.define("geometry", JsonLoader.get(entry, "description", "identifier"));
            }
        }

        if (!JsonLoader.isObject(this.value)) {
            return;
        }

        for (const key of Object.keys(this.value)) {
            if (key.startsWith(GeometryReader.LEGACY_KEY_PREFIX)) {
                this.define("geometry", key);
            }
        }
    }

    private collectClientEntity(): void {
        const description = JsonLoader.get(this.value, "minecraft:client_entity", "description");

        this.reference("entity", JsonLoader.get(description, "identifier"), "description.identifier");
        this.collectVisualReferences(description);
    }

    private collectAttachable(): void {
        this.collectVisualReferences(JsonLoader.get(this.value, "minecraft:attachable", "description"));
    }

    private collectVisualReferences(description: JsonValue | undefined): void {
        this.referenceValues("geometry", JsonLoader.get(description, "geometry"), "geometry");
        this.referenceValues("texture", JsonLoader.get(description, "textures"), "textures");
        this.collectAnimationAliases(JsonLoader.get(description, "animations"), "animations");
        this.referenceValues("sound_event", JsonLoader.get(description, "sound_effects"), "sound_effects");
        this.referenceValues("particle", JsonLoader.get(description, "particle_effects"), "particle_effects");
        this.referenceValues("particle", JsonLoader.get(description, "particle_emitters"), "particle_emitters");
        this.collectRenderControllers(JsonLoader.get(description, "render_controllers"));
    }

    private collectRenderControllers(controllers: JsonValue | undefined): void {
        if (!JsonLoader.isArray(controllers)) {
            return;
        }

        for (const entry of controllers) {
            if (typeof entry === "string") {
                this.reference("render_controller", entry, "render_controllers");
                continue;
            }

            this.referenceKeys("render_controller", entry, "render_controllers");
        }
    }

    private collectParticle(): void {
        const description = JsonLoader.get(this.value, "particle_effect", "description");

        this.define("particle", JsonLoader.get(description, "identifier"));

        const texture = JsonLoader.get(description, "basic_render_parameters", "texture");

        if (typeof texture === "string" && TextureFormat.isEngineAtlas(texture)) {
            return;
        }

        this.reference("texture", texture, "description.basic_render_parameters.texture");
    }

    private collectAtlas(): void {
        this.collectTexturePathStrings(JsonLoader.get(this.value, "texture_data"), "texture_data");
    }

    private collectUi(): void {
        this.collectTexturePathStrings(this.value, "");

        for (const match of JsonLoader.collectStrings(this.value, CrossReferenceCollector.hasTexturePrefixLiteral)) {
            for (const literal of match.value.matchAll(CrossReferenceCollector.TEXTURE_PREFIX_LITERAL)) {
                this.reference("texture_prefix", literal[1], match.field);
            }
        }
    }

    private static hasTexturePrefixLiteral(text: string): boolean {
        return text.includes(CrossReferenceCollector.TEXTURE_PREFIX_MARKER);
    }

    private collectFlipbook(): void {
        if (!JsonLoader.isArray(this.value)) {
            return;
        }

        for (const entry of this.value) {
            this.reference("texture", JsonLoader.get(entry, "flipbook_texture"), "flipbook_texture");
        }
    }

    private collectTextureSet(): void {
        const set = JsonLoader.get(this.value, TextureFormat.TEXTURE_SET_ROOT);

        if (!JsonLoader.isObject(set)) {
            return;
        }

        for (const [key, entry] of Object.entries(set)) {
            if (typeof entry !== "string" || TextureFormat.isColorLiteral(entry)) {
                continue;
            }

            this.reference(
                "texture",
                TextureFormat.resolveTextureSetLayer(this.item.packPath, entry),
                TextureFormat.TEXTURE_SET_ROOT + "." + key
            );
        }
    }

    private collectAnimations(): void {
        this.defineKeys("animation", JsonLoader.get(this.value, "animations"));
    }

    private collectAnimationControllers(): void {
        const controllers = JsonLoader.get(this.value, "animation_controllers");

        this.defineKeys("animation", controllers);

        if (!JsonLoader.isObject(controllers)) {
            return;
        }

        for (const [name, controller] of Object.entries(controllers)) {
            this.collectControllerStates(JsonLoader.get(controller, "states"), name);
        }
    }

    private collectControllerStates(states: JsonValue | undefined, controllerName: string): void {
        if (!JsonLoader.isObject(states)) {
            return;
        }

        for (const [stateName, state] of Object.entries(states)) {
            const animations = JsonLoader.get(state, "animations");

            if (!JsonLoader.isArray(animations)) {
                continue;
            }

            for (const entry of animations) {
                this.referenceAnimationEntry(entry, controllerName + ".states." + stateName + ".animations");
            }
        }
    }

    private referenceAnimationEntry(entry: JsonValue, field: string): void {
        if (typeof entry === "string") {
            this.reference("animation_alias", entry, field);
            return;
        }

        this.referenceKeys("animation_alias", entry, field);
    }

    private collectSoundDefinitions(): void {
        const definitions = JsonLoader.get(this.value, "sound_definitions");
        const container = JsonLoader.isObject(definitions) ? definitions : this.value;

        if (!JsonLoader.isObject(container)) {
            return;
        }

        for (const [name, definition] of Object.entries(container)) {
            if (name === JsonKeys.FORMAT_VERSION) {
                continue;
            }

            this.define("sound_event", name);
            this.collectSoundFiles(JsonLoader.get(definition, "sounds"), name);
        }
    }

    private collectSoundFiles(sounds: JsonValue | undefined, definitionName: string): void {
        if (!JsonLoader.isArray(sounds)) {
            return;
        }

        for (const entry of sounds) {
            const name = typeof entry === "string" ? entry : JsonLoader.get(entry, "name");

            this.reference("sound", name, definitionName + ".sounds");
        }
    }

    private collectSoundEvents(value: JsonValue | undefined, field: string): void {
        if (!JsonLoader.isObject(value)) {
            return;
        }

        for (const [key, entry] of Object.entries(value)) {
            const childField = field === "" ? key : field + "." + key;

            if (CrossReferenceCollector.SOUND_EVENT_CONTAINER_KEYS.includes(key)) {
                this.referenceSoundEventContainer(entry, childField);
                continue;
            }

            this.collectSoundEvents(entry, childField);
        }
    }

    private referenceSoundEventContainer(value: JsonValue | undefined, field: string): void {
        if (typeof value === "string" || JsonLoader.get(value, "sound") !== undefined) {
            this.referenceSoundEventValue(value, field);
            return;
        }

        if (!JsonLoader.isObject(value)) {
            return;
        }

        for (const [key, entry] of Object.entries(value)) {
            this.referenceSoundEventValue(entry, field + "." + key);
        }
    }

    private referenceSoundEventValue(value: JsonValue | undefined, field: string): void {
        if (typeof value === "string") {
            this.reference("sound_event", value, field);
            return;
        }

        this.reference("sound_event", JsonLoader.get(value, "sound"), field + ".sound");
    }

    private collectServerEntity(): void {
        const description = JsonLoader.get(this.value, EntitySchema.ROOT_KEY, "description");

        this.define("entity", JsonLoader.get(description, "identifier"));
        this.collectAnimationAliases(JsonLoader.get(description, "animations"), "description.animations");
    }

    private collectAnimationAliases(aliases: JsonValue | undefined, field: string): void {
        this.defineKeys("animation_alias", aliases);
        this.referenceValues("animation", aliases, field);
    }

    private collectRecipe(value: JsonValue | undefined, field: string): void {
        if (JsonLoader.isArray(value)) {
            for (const entry of value) {
                this.collectRecipe(entry, field);
            }

            return;
        }

        if (!JsonLoader.isObject(value)) {
            return;
        }

        for (const [key, entry] of Object.entries(value)) {
            const childField = field === "" ? key : field + "." + key;

            if (CrossReferenceCollector.RECIPE_ITEM_KEYS.includes(key) && typeof entry === "string") {
                this.referenceItem(entry, childField);
                continue;
            }

            if (key === "key" && JsonLoader.isObject(entry)) {
                this.collectRecipeKeys(entry, childField);
                continue;
            }

            this.collectRecipe(entry, childField);
        }
    }

    private collectRecipeKeys(keys: JsonObject, field: string): void {
        for (const [symbol, entry] of Object.entries(keys)) {
            if (typeof entry === "string") {
                this.referenceItem(entry, field + "." + symbol);
                continue;
            }

            this.collectRecipe(entry, field + "." + symbol);
        }
    }

    private referenceItem(id: string, field: string): void {
        if (id.startsWith(CrossReferenceCollector.TAG_PREFIX)) {
            return;
        }

        const parts = id.split(":");
        const withoutData = parts.length > 2 ? parts.slice(0, 2).join(":") : id;

        this.reference("item", withoutData, field);
    }

    private collectTexturePathStrings(value: JsonValue | undefined, field: string): void {
        const matches = JsonLoader.collectStrings(value, TextureFormat.isTexturePath, field);

        for (const match of matches) {
            this.reference("texture", match.value, match.field);
        }
    }

    private defineKeys(kind: LinkKind, container: JsonValue | undefined): void {
        if (!JsonLoader.isObject(container)) {
            return;
        }

        for (const key of Object.keys(container)) {
            this.define(kind, key);
        }
    }

    private referenceKeys(kind: LinkKind, container: JsonValue | undefined, field: string): void {
        if (!JsonLoader.isObject(container)) {
            return;
        }

        for (const key of Object.keys(container)) {
            this.reference(kind, key, field);
        }
    }

    private referenceValues(kind: LinkKind, container: JsonValue | undefined, field: string): void {
        if (!JsonLoader.isObject(container)) {
            return;
        }

        for (const [key, entry] of Object.entries(container)) {
            this.reference(kind, entry, field + "." + key);
        }
    }

    private define(kind: LinkKind, id: JsonValue | undefined): void {
        const normalized = this.normalizeId(kind, id);

        if (normalized === undefined) {
            return;
        }

        this.output.definitions.push({ kind, id: normalized, path: this.item.path, pack: this.pack.root });
    }

    private reference(kind: LinkKind, id: JsonValue | undefined, field: string): void {
        const normalized = this.normalizeId(kind, id);

        if (normalized === undefined) {
            return;
        }

        this.output.references.push({ kind, id: normalized, path: this.item.path, pack: this.pack.root, field });
    }

    private normalizeId(kind: LinkKind, id: JsonValue | undefined): string | undefined {
        if (typeof id !== "string") {
            return undefined;
        }

        if (kind === "texture" || kind === "sound") {
            return PathUtilities.normalizeReference(id);
        }

        if (kind === "texture_prefix") {
            return PathUtilities.normalize(id).toLowerCase();
        }

        const trimmed = kind === "geometry" ? id.split(":")[0].trim() : id.trim();

        return trimmed === "" ? undefined : trimmed;
    }
}
