import type { GameVersion, JsonObject, JsonValue } from "../Types/LoaderTypes.js";
import type { Pack } from "../Types/ModelTypes.js";
import type Loaders from "./Loaders.js";
import JsonKeys from "../Data/JsonKeys.js";
import JsonLoader from "./JsonLoader.js";
import VersionUtilities from "./VersionUtilities.js";

export default abstract class ManifestLoader {
    private static readonly UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    static async read(loaders: Loaders, pack: Pack): Promise<JsonObject | undefined> {
        return loaders.json.readObject(pack.manifestPath);
    }

    static header(manifest: JsonObject | undefined): JsonObject | undefined {
        const header = JsonLoader.get(manifest, "header");

        return JsonLoader.isObject(header) ? header : undefined;
    }

    static modules(manifest: JsonObject | undefined): JsonObject[] {
        return ManifestLoader.objectArray(JsonLoader.get(manifest, "modules"));
    }

    static dependencies(manifest: JsonObject | undefined): JsonObject[] {
        return ManifestLoader.objectArray(JsonLoader.get(manifest, "dependencies"));
    }

    static subpacks(manifest: JsonObject | undefined): JsonObject[] {
        return ManifestLoader.objectArray(JsonLoader.get(manifest, "subpacks"));
    }

    static settings(manifest: JsonObject | undefined): JsonObject[] {
        return ManifestLoader.objectArray(JsonLoader.get(manifest, "settings"));
    }

    static optionNames(setting: JsonObject): string[] {
        if (!JsonLoader.isArray(setting.options)) {
            return [];
        }

        return setting.options.map((option) => JsonLoader.get(option, "name")).filter((name): name is string => typeof name === "string");
    }

    static capabilities(manifest: JsonObject | undefined): string[] {
        const value = JsonLoader.get(manifest, "capabilities");

        if (!JsonLoader.isArray(value)) {
            return [];
        }

        return value.filter((entry): entry is string => typeof entry === "string");
    }

    static formatVersion(manifest: JsonObject | undefined): number | undefined {
        const value = JsonLoader.get(manifest, JsonKeys.FORMAT_VERSION);

        return typeof value === "number" ? value : undefined;
    }

    static headerUuid(manifest: JsonObject | undefined): string | undefined {
        const uuid = JsonLoader.get(manifest, "header", "uuid");

        return typeof uuid === "string" ? uuid : undefined;
    }

    static headerVersion(manifest: JsonObject | undefined): GameVersion | undefined {
        return VersionUtilities.parse(JsonLoader.get(manifest, "header", "version"));
    }

    static minEngineVersion(manifest: JsonObject | undefined): GameVersion | undefined {
        return VersionUtilities.parse(JsonLoader.get(manifest, "header", "min_engine_version"));
    }

    static isValidUuid(value: JsonValue | undefined): value is string {
        return typeof value === "string" && ManifestLoader.UUID_PATTERN.test(value);
    }

    static moduleTypes(manifest: JsonObject | undefined): string[] {
        return ManifestLoader.modules(manifest)
            .map((module) => module.type)
            .filter((type): type is string => typeof type === "string")
            .map((type) => type.toLowerCase());
    }

    static hasModuleType(manifest: JsonObject | undefined, type: string): boolean {
        return ManifestLoader.moduleTypes(manifest).includes(type);
    }

    static hasCapability(manifest: JsonObject | undefined, name: string): boolean {
        return ManifestLoader.capabilities(manifest).some((capability) => capability.toLowerCase() === name);
    }

    static hasDependencyUuid(dependency: JsonObject): boolean {
        return typeof dependency.uuid === "string" && dependency.uuid !== "";
    }

    static hasDependencyModuleName(dependency: JsonObject): boolean {
        return typeof dependency.module_name === "string" && dependency.module_name !== "";
    }

    static versionsEqual(left: GameVersion | undefined, right: GameVersion | undefined): boolean {
        if (left === undefined || right === undefined) {
            return false;
        }

        return VersionUtilities.compare(left, right) === 0;
    }

    private static objectArray(value: JsonValue | undefined): JsonObject[] {
        if (!JsonLoader.isArray(value)) {
            return [];
        }

        return value.filter((entry): entry is JsonObject => JsonLoader.isObject(entry));
    }
}
