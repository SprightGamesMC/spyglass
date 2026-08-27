import type { CheckContext } from "../Types/CheckTypes.js";
import type { GeometryDefinition } from "../Types/GeometryTypes.js";
import type { JsonObject, JsonValue } from "../Types/LoaderTypes.js";
import JsonLoader from "./JsonLoader.js";

export default abstract class GeometryReader {
    static readonly GEOMETRY_KEY = "minecraft:geometry";
    static readonly LEGACY_KEY_PREFIX = "geometry.";

    static read(context: CheckContext, path: string): Promise<GeometryDefinition[]> {
        return GeometryReader.readFrom(context.loaders.json, path);
    }

    static async readFrom(json: JsonLoader, path: string): Promise<GeometryDefinition[]> {
        const root = await json.readObject(path);

        if (root === undefined) {
            return [];
        }

        const modern = root[GeometryReader.GEOMETRY_KEY];

        if (modern !== undefined) {
            return GeometryReader.readModern(modern);
        }

        return GeometryReader.readLegacy(root);
    }

    private static readModern(value: JsonValue): GeometryDefinition[] {
        const entries = JsonLoader.isArray(value) ? value : [value];
        const definitions: GeometryDefinition[] = [];

        entries.forEach((entry, index) => {
            if (!JsonLoader.isObject(entry)) {
                return;
            }

            const identifier = JsonLoader.get(entry, "description", "identifier");

            definitions.push({
                identifier: typeof identifier === "string" ? identifier : GeometryReader.GEOMETRY_KEY + "[" + index + "]",
                bones: GeometryReader.bonesOf(entry),
            });
        });

        return definitions;
    }

    private static readLegacy(root: JsonObject): GeometryDefinition[] {
        const definitions: GeometryDefinition[] = [];

        for (const [key, entry] of Object.entries(root)) {
            if (!key.startsWith(GeometryReader.LEGACY_KEY_PREFIX) || !JsonLoader.isObject(entry)) {
                continue;
            }

            definitions.push({ identifier: key, bones: GeometryReader.bonesOf(entry) });
        }

        return definitions;
    }

    private static bonesOf(definition: JsonObject): JsonObject[] {
        const bones = definition["bones"];

        if (!JsonLoader.isArray(bones)) {
            return [];
        }

        return bones.filter((bone) => JsonLoader.isObject(bone));
    }
}
