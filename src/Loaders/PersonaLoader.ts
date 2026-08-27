import type { CheckContext } from "../Types/CheckTypes.js";
import type { JsonObject, JsonValue } from "../Types/LoaderTypes.js";
import type { ContentItem, Pack } from "../Types/ModelTypes.js";
import type {
    GeometryIdentifierParts,
    PersonaGeometryDefinition,
    PersonaImageSource,
    PersonaLangFile,
    PersonaPackData,
    PersonaSourceEntry,
    PersonaSourcePredicate,
    PersonaTextureReference,
} from "../Types/PersonaTypes.js";
import type Loaders from "./Loaders.js";
import PathUtilities from "../Storage/PathUtilities.js";
import GeometryReader from "./GeometryReader.js";
import JsonLoader from "./JsonLoader.js";
import PersonaFormat from "./PersonaFormat.js";

export default abstract class PersonaLoader {
    private static readonly TEXTURE_FIELDS: readonly string[] = ["texture", "tint_map"];
    private static readonly CACHE_KEY = "persona-packs";
    private static readonly CACHE_KEY_PREFIX = "persona-lang:";

    static packs(context: CheckContext): Promise<PersonaPackData[]> {
        return context.loaders.cached(PersonaLoader.CACHE_KEY, () =>
            Promise.all(context.model.packs.map((pack) => PersonaLoader.collect(context.loaders, pack)))
        );
    }

    static async pieces(context: CheckContext): Promise<PersonaPackData[]> {
        return (await PersonaLoader.packs(context)).filter((data) => !data.isEmote);
    }

    static async emotes(context: CheckContext): Promise<PersonaPackData[]> {
        return (await PersonaLoader.packs(context)).filter((data) => data.isEmote);
    }

    static lang(context: CheckContext, pack: Pack): Promise<PersonaLangFile | undefined> {
        return context.loaders.cached(PersonaLoader.CACHE_KEY_PREFIX + pack.root, () => PersonaLoader.loadLang(context.loaders, pack));
    }

    static metaNameWithoutExtension(metaPath: string): string {
        const name = PathUtilities.fileName(metaPath);

        return name.slice(0, name.length - PersonaFormat.META_SUFFIX.length);
    }

    static string(object: JsonObject | undefined, key: string): string | undefined {
        const value = JsonLoader.get(object, key);

        return typeof value === "string" ? value : undefined;
    }

    static hasSources(meta: JsonObject | undefined, key: string): boolean {
        const value = JsonLoader.get(meta, key);

        return JsonLoader.isArray(value) && value.length > 0;
    }

    static textureSources(meta: JsonObject | undefined): PersonaSourceEntry[] {
        return PersonaLoader.sources(meta, PersonaFormat.TEXTURE_SOURCES_KEY);
    }

    static geometrySources(meta: JsonObject | undefined): PersonaSourceEntry[] {
        return PersonaLoader.sources(meta, PersonaFormat.GEOMETRY_SOURCES_KEY);
    }

    static animationSource(meta: JsonObject | undefined): PersonaSourceEntry | undefined {
        return PersonaLoader.animationSources(meta)[0];
    }

    static textureReferences(meta: JsonObject | undefined): PersonaTextureReference[] {
        const references: PersonaTextureReference[] = [];
        const sources = [...PersonaLoader.textureSources(meta), ...PersonaLoader.geometrySources(meta)];

        for (const source of sources) {
            for (const field of PersonaLoader.TEXTURE_FIELDS) {
                const name = PersonaLoader.string(source.entry, field);

                if (name !== undefined) {
                    references.push({ name, field: source.field + "." + field });
                }
            }
        }

        return references;
    }

    static async imageSources(
        context: CheckContext,
        data: PersonaPackData,
        sources: readonly PersonaSourceEntry[],
        select: PersonaSourcePredicate
    ): Promise<PersonaImageSource[]> {
        const images: PersonaImageSource[] = [];
        const seen = new Set<string>();

        for (const source of sources) {
            const name = PersonaLoader.string(source.entry, "texture");

            if (name === undefined || !select(source.entry)) {
                continue;
            }

            const item = PersonaLoader.findItem(data.pack, name);

            if (item === undefined || seen.has(item.path)) {
                continue;
            }

            seen.add(item.path);

            const image = await context.loaders.image.read(item.path);

            if (image.metadata !== undefined) {
                images.push({ name, item, field: source.field + ".texture", metadata: image.metadata });
            }
        }

        return images;
    }

    static isHeadTexture(entry: JsonObject): boolean {
        return entry.use_face_uv === true;
    }

    static isAnimated(entry: JsonObject): boolean {
        return entry.animated === true;
    }

    static findItem(pack: Pack, packPath: string): ContentItem | undefined {
        return pack.items.find((item) => item.packPath === packPath);
    }

    static isPowerOfTwo(value: number): boolean {
        return Number.isInteger(value) && value > 0 && (value & (value - 1)) === 0;
    }

    static parseGeometryIdentifier(identifier: string): GeometryIdentifierParts | undefined {
        if (!identifier.startsWith(PersonaFormat.GEOMETRY_PREFIX)) {
            return undefined;
        }

        const segments = identifier.slice(PersonaFormat.GEOMETRY_PREFIX.length).split(".");
        const zone = PersonaLoader.popKnown(segments, PersonaFormat.ZONES);
        const side = PersonaLoader.popKnown(segments, PersonaFormat.SIDES);
        const armSize = PersonaLoader.popKnown(segments, PersonaFormat.ARM_SIZES);
        const bodySize = PersonaLoader.popKnown(segments, PersonaFormat.BODY_SIZES);
        const name = segments.join(".");

        if (bodySize === undefined || name === "") {
            return undefined;
        }

        return { name, bodySize, armSize, side, zone };
    }

    static zoneList(value: JsonValue | undefined): string[] {
        if (typeof value === "string") {
            return [value];
        }

        if (!JsonLoader.isArray(value)) {
            return [];
        }

        return value.filter((entry): entry is string => typeof entry === "string");
    }

    static zonesInValue(value: JsonValue | undefined): string[] {
        if (JsonLoader.isArray(value)) {
            return value.flatMap((entry) => PersonaLoader.zonesInValue(entry));
        }

        if (!JsonLoader.isObject(value)) {
            return [];
        }

        const zones: string[] = [];

        for (const [key, entry] of Object.entries(value)) {
            if (key === "zone") {
                zones.push(...PersonaLoader.zoneList(entry));
                continue;
            }

            zones.push(...PersonaLoader.zonesInValue(entry));
        }

        return zones;
    }

    private static sources(meta: JsonObject | undefined, key: string): PersonaSourceEntry[] {
        const value = JsonLoader.get(meta, key);

        if (!JsonLoader.isArray(value)) {
            return [];
        }

        const entries: PersonaSourceEntry[] = [];

        value.forEach((entry, index) => {
            if (JsonLoader.isObject(entry)) {
                entries.push({ entry, field: key + "[" + index + "]" });
            }
        });

        return entries;
    }

    private static animationSources(meta: JsonObject | undefined): PersonaSourceEntry[] {
        return PersonaLoader.sources(meta, PersonaFormat.ANIMATION_SOURCES_KEY);
    }

    private static popKnown(segments: string[], known: readonly string[]): string | undefined {
        if (segments.length < 2 || !known.includes(segments[segments.length - 1])) {
            return undefined;
        }

        return segments.pop();
    }

    private static async collect(loaders: Loaders, pack: Pack): Promise<PersonaPackData> {
        const metaPaths = pack.items
            .filter((item) => item.kind === "persona_meta")
            .map((item) => item.path)
            .sort();
        const geometryPaths = pack.items
            .filter((item) => item.kind === "persona_geometry")
            .map((item) => item.path)
            .sort();
        const metaPath = metaPaths[0];
        const meta = metaPath === undefined ? undefined : await loaders.json.readObject(metaPath);
        const geometry: PersonaGeometryDefinition[] = [];

        for (const path of geometryPaths) {
            geometry.push(...(await PersonaLoader.loadGeometry(loaders, path)));
        }

        const isEmote = PersonaLoader.string(meta, "piece_type") === PersonaFormat.EMOTE_TYPE;

        return { pack, metaPaths, metaPath, meta, geometryPaths, geometry, isEmote };
    }

    private static async loadGeometry(loaders: Loaders, path: string): Promise<PersonaGeometryDefinition[]> {
        const definitions = await GeometryReader.readFrom(loaders.json, path);

        return definitions.map((definition) => ({ path, identifier: definition.identifier }));
    }

    private static async loadLang(loaders: Loaders, pack: Pack): Promise<PersonaLangFile | undefined> {
        const item = PersonaLoader.findItem(pack, PersonaFormat.LANG_PATH);

        if (item === undefined) {
            return undefined;
        }

        const entries = await loaders.text.readLangEntries(item.path);

        return entries === undefined ? undefined : { path: item.path, entries };
    }
}
