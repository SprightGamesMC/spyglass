import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { JsonObject } from "../../Types/LoaderTypes.js";
import type { Pack } from "../../Types/ModelTypes.js";
import ManifestLoader from "../../Loaders/ManifestLoader.js";
import ManifestCheck from "./ManifestCheck.js";
import ManifestChecks from "./ManifestChecks.js";

export default class SubpackNameDuplicate extends ManifestCheck {
    readonly definition: CheckDefinition = {
        group: ManifestChecks.GROUP,
        number: ManifestChecks.SUBPACK_NAME_DUPLICATE,
        slug: "subpack-name-duplicate",
        severity: "error",
        description: "Two subpacks use the same name",
    };

    protected async checkManifest(_context: CheckContext, pack: Pack, manifest: JsonObject): Promise<Finding[]> {
        const names = ManifestLoader.subpacks(manifest)
            .map((subpack) => subpack.name)
            .filter((name): name is string => typeof name === "string");

        return this.duplicates(names).map((name) =>
            this.manifestFinding(pack, "subpack name " + name + " is used more than once", "subpacks")
        );
    }
}
