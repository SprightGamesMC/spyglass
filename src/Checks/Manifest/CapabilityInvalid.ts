import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { JsonObject } from "../../Types/LoaderTypes.js";
import type { Pack } from "../../Types/ModelTypes.js";
import ManifestLoader from "../../Loaders/ManifestLoader.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import ManifestCheck from "./ManifestCheck.js";
import ManifestChecks from "./ManifestChecks.js";
import ManifestLimits from "./ManifestLimits.js";

export default class CapabilityInvalid extends ManifestCheck {
    readonly definition: CheckDefinition = {
        group: ManifestChecks.GROUP,
        number: ManifestChecks.CAPABILITY_INVALID,
        slug: "capability-invalid",
        severity: "error",
        description: "Resource pack declares a capability other than pbr",
    };

    protected async checkManifest(_context: CheckContext, pack: Pack, manifest: JsonObject): Promise<Finding[]> {
        if (pack.type !== PackItemLoader.RESOURCE_PACK_TYPE) {
            return [];
        }

        const findings: Finding[] = [];
        const allowed = ManifestLimits.ALLOWED_CAPABILITIES.join(", ");

        ManifestLoader.capabilities(manifest).forEach((capability, index) => {
            if (ManifestLimits.ALLOWED_CAPABILITIES.includes(capability.toLowerCase())) {
                return;
            }

            const field = "capabilities[" + index + "]";

            findings.push(this.manifestFinding(pack, "capability " + capability + " is not one of " + allowed, field));
        });

        return findings;
    }
}
