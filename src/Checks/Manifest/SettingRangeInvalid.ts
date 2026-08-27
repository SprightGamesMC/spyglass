import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { JsonObject } from "../../Types/LoaderTypes.js";
import type { Pack } from "../../Types/ModelTypes.js";
import ManifestLoader from "../../Loaders/ManifestLoader.js";
import ManifestCheck from "./ManifestCheck.js";
import ManifestChecks from "./ManifestChecks.js";

export default class SettingRangeInvalid extends ManifestCheck {
    readonly definition: CheckDefinition = {
        group: ManifestChecks.GROUP,
        number: ManifestChecks.SETTING_RANGE_INVALID,
        slug: "setting-range-invalid",
        severity: "error",
        description: "Slider min, max, or step inconsistent",
    };

    protected async checkManifest(_context: CheckContext, pack: Pack, manifest: JsonObject): Promise<Finding[]> {
        const findings: Finding[] = [];

        ManifestLoader.settings(manifest).forEach((setting, index) => {
            if (setting.type !== "slider" || typeof setting.min !== "number" || typeof setting.max !== "number") {
                return;
            }

            const field = "settings[" + index + "]";

            if (setting.min > setting.max) {
                const message = "slider min " + setting.min + " is greater than max " + setting.max;

                findings.push(this.manifestFinding(pack, message, field + ".min"));

                return;
            }

            if (typeof setting.step !== "number") {
                return;
            }

            const range = setting.max - setting.min;

            if (setting.step <= 0 || setting.step > range) {
                const message = "slider step " + setting.step + " must be greater than 0 and not greater than " + range;

                findings.push(this.manifestFinding(pack, message, field + ".step"));
            }
        });

        return findings;
    }
}
