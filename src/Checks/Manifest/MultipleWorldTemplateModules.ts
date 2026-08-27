import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { JsonObject } from "../../Types/LoaderTypes.js";
import type { Pack } from "../../Types/ModelTypes.js";
import ManifestLoader from "../../Loaders/ManifestLoader.js";
import ManifestCheck from "./ManifestCheck.js";
import ManifestChecks from "./ManifestChecks.js";
import ManifestLimits from "./ManifestLimits.js";

export default class MultipleWorldTemplateModules extends ManifestCheck {
    readonly definition: CheckDefinition = {
        group: ManifestChecks.GROUP,
        number: ManifestChecks.MULTIPLE_WORLD_TEMPLATE_MODULES,
        slug: "multiple-world-template-modules",
        severity: "error",
        description: "More than one world_template module",
    };

    protected async checkManifest(_context: CheckContext, pack: Pack, manifest: JsonObject): Promise<Finding[]> {
        const count = ManifestLoader.moduleTypes(manifest).filter((type) => type === ManifestLimits.WORLD_TEMPLATE_MODULE_TYPE).length;

        if (count <= 1) {
            return [];
        }

        return [this.manifestFinding(pack, "modules has " + count + " world_template modules, expected 1", "modules")];
    }
}
