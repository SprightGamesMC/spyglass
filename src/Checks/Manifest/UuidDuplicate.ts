import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { JsonObject } from "../../Types/LoaderTypes.js";
import type { Pack } from "../../Types/ModelTypes.js";
import ManifestLoader from "../../Loaders/ManifestLoader.js";
import ManifestCheck from "./ManifestCheck.js";
import ManifestChecks from "./ManifestChecks.js";

export default class UuidDuplicate extends ManifestCheck {
    readonly definition: CheckDefinition = {
        group: ManifestChecks.GROUP,
        number: ManifestChecks.UUID_DUPLICATE,
        slug: "uuid-duplicate",
        severity: "error",
        description: "Same uuid used more than once",
    };

    protected async checkManifest(_context: CheckContext, pack: Pack, manifest: JsonObject): Promise<Finding[]> {
        const candidates = [
            ManifestLoader.headerUuid(manifest),
            ...ManifestLoader.modules(manifest).map((module) => module.uuid),
            ...ManifestLoader.dependencies(manifest).map((dependency) => dependency.uuid),
        ];
        const valid = candidates.filter((uuid) => ManifestLoader.isValidUuid(uuid)).map((uuid) => uuid.toLowerCase());

        return this.duplicates(valid).map((uuid) =>
            this.manifestFinding(pack, "uuid " + uuid + " is used more than once in header, modules, or dependencies")
        );
    }
}
