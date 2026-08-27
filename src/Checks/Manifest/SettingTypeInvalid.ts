import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { JsonObject } from "../../Types/LoaderTypes.js";
import type { Pack } from "../../Types/ModelTypes.js";
import ManifestLoader from "../../Loaders/ManifestLoader.js";
import ManifestCheck from "./ManifestCheck.js";
import ManifestChecks from "./ManifestChecks.js";
import ManifestLimits from "./ManifestLimits.js";

export default class SettingTypeInvalid extends ManifestCheck {
    readonly definition: CheckDefinition = {
        group: ManifestChecks.GROUP,
        number: ManifestChecks.SETTING_TYPE_INVALID,
        slug: "setting-type-invalid",
        severity: "error",
        description: "Setting type not recognized",
    };

    protected async checkManifest(_context: CheckContext, pack: Pack, manifest: JsonObject): Promise<Finding[]> {
        const findings: Finding[] = [];
        const known = ManifestLimits.KNOWN_SETTING_TYPES.join(", ");

        ManifestLoader.settings(manifest).forEach((setting, index) => {
            const field = "settings[" + index + "].type";

            if (typeof setting.type !== "string") {
                findings.push(this.manifestFinding(pack, field + " is missing, expected one of " + known, field));

                return;
            }

            if (ManifestLimits.KNOWN_SETTING_TYPES.includes(setting.type)) {
                return;
            }

            findings.push(this.manifestFinding(pack, field + " " + setting.type + " is not one of " + known, field));
        });

        return findings;
    }
}
