import type { JsonObject } from "../Types/LoaderTypes.js";
import type { ManifestShapeResult } from "../Types/ManifestShapeTypes.js";
import type { Pack } from "../Types/ModelTypes.js";
import type Loaders from "./Loaders.js";
import ManifestSchema from "../Data/Schemas/ManifestSchema.js";
import SchemaValidator from "./SchemaValidator.js";

export default abstract class ManifestStructureLoader {
    private static readonly CACHE_KEY_PREFIX = "manifest-structure:";

    static validate(loaders: Loaders, pack: Pack): Promise<ManifestShapeResult> {
        return loaders.cached(ManifestStructureLoader.CACHE_KEY_PREFIX + pack.manifestPath, () =>
            ManifestStructureLoader.compute(loaders, pack)
        );
    }

    static async read(loaders: Loaders, pack: Pack): Promise<JsonObject | undefined> {
        const result = await ManifestStructureLoader.validate(loaders, pack);

        return result.status === "ok" ? result.manifest : undefined;
    }

    private static async compute(loaders: Loaders, pack: Pack): Promise<ManifestShapeResult> {
        const parsed = await loaders.json.read(pack.manifestPath);

        if (parsed.status !== "ok") {
            return { status: "unparsed", issues: [] };
        }

        const issues = SchemaValidator.validate(parsed.value, ManifestSchema.SCHEMA);

        if (issues.length > 0) {
            return { status: "invalid", issues };
        }

        return { status: "ok", manifest: parsed.value as JsonObject, issues };
    }
}
