import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { JsonObject } from "../../Types/LoaderTypes.js";
import type { Pack } from "../../Types/ModelTypes.js";
import ManifestLoader from "../../Loaders/ManifestLoader.js";
import ManifestCheck from "./ManifestCheck.js";
import ManifestChecks from "./ManifestChecks.js";
import ManifestLimits from "./ManifestLimits.js";

export default class SettingFieldMissing extends ManifestCheck {
    readonly definition: CheckDefinition = {
        group: ManifestChecks.GROUP,
        number: ManifestChecks.SETTING_FIELD_MISSING,
        slug: "setting-field-missing",
        severity: "error",
        description: "Setting lacks a required field",
    };

    protected async checkManifest(_context: CheckContext, pack: Pack, manifest: JsonObject): Promise<Finding[]> {
        const findings: Finding[] = [];

        ManifestLoader.settings(manifest).forEach((setting, index) => {
            const type = typeof setting.type === "string" ? setting.type : "";
            const required = ManifestLimits.SETTING_REQUIRED_FIELDS[type];

            if (required === undefined) {
                return;
            }

            for (const field of required) {
                if (setting[field] !== undefined) {
                    continue;
                }

                const location = "settings[" + index + "]." + field;

                findings.push(this.manifestFinding(pack, type + " setting is missing " + field, location));
            }
        });

        return findings;
    }
}
