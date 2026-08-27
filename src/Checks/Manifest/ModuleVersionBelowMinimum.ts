import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { JsonObject } from "../../Types/LoaderTypes.js";
import type { Pack } from "../../Types/ModelTypes.js";
import ManifestLoader from "../../Loaders/ManifestLoader.js";
import VersionUtilities from "../../Loaders/VersionUtilities.js";
import ManifestCheck from "./ManifestCheck.js";
import ManifestChecks from "./ManifestChecks.js";
import ManifestLimits from "./ManifestLimits.js";

export default class ModuleVersionBelowMinimum extends ManifestCheck {
    readonly definition: CheckDefinition = {
        group: ManifestChecks.GROUP,
        number: ManifestChecks.MODULE_VERSION_BELOW_MINIMUM,
        slug: "module-version-below-minimum",
        severity: "error",
        description: "Script module dependency version 1.0.0 or lower",
    };

    protected async checkManifest(_context: CheckContext, pack: Pack, manifest: JsonObject): Promise<Finding[]> {
        const findings: Finding[] = [];

        ManifestLoader.dependencies(manifest).forEach((dependency, index) => {
            const moduleName = dependency.module_name;

            if (typeof moduleName !== "string" || !Object.hasOwn(ManifestLimits.ALLOWED_DEPENDENCY_MODULES, moduleName)) {
                return;
            }

            const minimum = ManifestLimits.ALLOWED_DEPENDENCY_MODULES[moduleName];
            const version = VersionUtilities.parse(dependency.version);

            if (version === undefined || VersionUtilities.compare(version, minimum) > 0) {
                return;
            }

            const field = "dependencies[" + index + "].version";
            const message =
                moduleName + " version " + VersionUtilities.format(version) + " must be above " + VersionUtilities.format(minimum);

            findings.push(this.manifestFinding(pack, message, field));
        });

        return findings;
    }
}
