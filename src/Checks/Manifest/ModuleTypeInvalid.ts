import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { JsonObject } from "../../Types/LoaderTypes.js";
import type { Pack } from "../../Types/ModelTypes.js";
import ManifestLoader from "../../Loaders/ManifestLoader.js";
import ManifestCheck from "./ManifestCheck.js";
import ManifestChecks from "./ManifestChecks.js";
import ManifestLimits from "./ManifestLimits.js";

export default class ModuleTypeInvalid extends ManifestCheck {
    readonly definition: CheckDefinition = {
        group: ManifestChecks.GROUP,
        number: ManifestChecks.MODULE_TYPE_INVALID,
        slug: "module-type-invalid",
        severity: "error",
        description: "Module type not recognized",
    };

    protected async checkManifest(_context: CheckContext, pack: Pack, manifest: JsonObject): Promise<Finding[]> {
        const findings: Finding[] = [];
        const known = ManifestLimits.KNOWN_MODULE_TYPES.join(", ");

        ManifestLoader.modules(manifest).forEach((module, index) => {
            const field = "modules[" + index + "].type";

            if (typeof module.type !== "string") {
                findings.push(this.manifestFinding(pack, field + " is missing, expected one of " + known, field));

                return;
            }

            if (ManifestLimits.KNOWN_MODULE_TYPES.includes(module.type.toLowerCase())) {
                return;
            }

            findings.push(this.manifestFinding(pack, field + " " + module.type + " is not one of " + known, field));
        });

        return findings;
    }
}
