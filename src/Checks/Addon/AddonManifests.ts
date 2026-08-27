import type { PackManifest } from "../../Types/AddonTypes.js";
import type { CheckContext } from "../../Types/CheckTypes.js";
import type { JsonObject } from "../../Types/LoaderTypes.js";
import type { PackType } from "../../Types/ModelTypes.js";
import ManifestLoader from "../../Loaders/ManifestLoader.js";

export default abstract class AddonManifests {
    static async valid(context: CheckContext, type: PackType): Promise<PackManifest[]> {
        const result: PackManifest[] = [];

        for (const pack of context.model.packs) {
            if (pack.type !== type) {
                continue;
            }

            const manifest = await ManifestLoader.read(context.loaders, pack);

            if (manifest === undefined) {
                continue;
            }

            result.push({ pack, manifest });
        }

        return result;
    }

    static nonScriptDependencies(manifest: JsonObject): JsonObject[] {
        return ManifestLoader.dependencies(manifest).filter((dependency) => !ManifestLoader.hasDependencyModuleName(dependency));
    }

    static dependencyUuid(dependency: JsonObject): string | undefined {
        const uuid = dependency.uuid;

        return typeof uuid === "string" ? uuid.toLowerCase() : undefined;
    }

    static dependencyField(manifest: JsonObject, dependency: JsonObject): string {
        return "dependencies[" + ManifestLoader.dependencies(manifest).indexOf(dependency) + "].uuid";
    }

    static headerUuids(manifests: readonly PackManifest[]): string[] {
        return manifests
            .map((entry) => ManifestLoader.headerUuid(entry.manifest))
            .filter((uuid): uuid is string => uuid !== undefined)
            .map((uuid) => uuid.toLowerCase());
    }
}
