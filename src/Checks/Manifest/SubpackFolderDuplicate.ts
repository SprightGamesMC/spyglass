import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { JsonObject } from "../../Types/LoaderTypes.js";
import type { Pack } from "../../Types/ModelTypes.js";
import ManifestLoader from "../../Loaders/ManifestLoader.js";
import ManifestCheck from "./ManifestCheck.js";
import ManifestChecks from "./ManifestChecks.js";

export default class SubpackFolderDuplicate extends ManifestCheck {
    readonly definition: CheckDefinition = {
        group: ManifestChecks.GROUP,
        number: ManifestChecks.SUBPACK_FOLDER_DUPLICATE,
        slug: "subpack-folder-duplicate",
        severity: "error",
        description: "Two subpacks use the same folder_name",
    };

    protected async checkManifest(_context: CheckContext, pack: Pack, manifest: JsonObject): Promise<Finding[]> {
        const folders = ManifestLoader.subpacks(manifest)
            .map((subpack) => subpack.folder_name)
            .filter((folder): folder is string => typeof folder === "string");

        return this.duplicates(folders).map((folder) =>
            this.manifestFinding(pack, "subpack folder_name " + folder + " is used more than once", "subpacks")
        );
    }
}
