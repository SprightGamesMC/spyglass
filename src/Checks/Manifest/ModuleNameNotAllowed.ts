import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { JsonObject } from "../../Types/LoaderTypes.js";
import type { Pack } from "../../Types/ModelTypes.js";
import ManifestLoader from "../../Loaders/ManifestLoader.js";
import ManifestCheck from "./ManifestCheck.js";
import ManifestChecks from "./ManifestChecks.js";
import ManifestLimits from "./ManifestLimits.js";

export default class ModuleNameNotAllowed extends ManifestCheck {
    readonly definition: CheckDefinition = {
        group: ManifestChecks.GROUP,
        number: ManifestChecks.MODULE_NAME_NOT_ALLOWED,
        slug: "module-name-not-allowed",
        severity: "error",
        description: "Dependency module_name not allowed",
    };

    protected async checkManifest(_context: CheckContext, pack: Pack, manifest: JsonObject): Promise<Finding[]> {
        const findings: Finding[] = [];
        const allowed = Object.keys(ManifestLimits.ALLOWED_DEPENDENCY_MODULES).join(", ");

        ManifestLoader.dependencies(manifest).forEach((dependency, index) => {
            const moduleName = dependency.module_name;

            if (typeof moduleName !== "string" || Object.hasOwn(ManifestLimits.ALLOWED_DEPENDENCY_MODULES, moduleName)) {
                return;
            }

            const field = "dependencies[" + index + "].module_name";

            findings.push(this.manifestFinding(pack, "module_name " + moduleName + " is not one of " + allowed, field));
        });

        return findings;
    }
}
