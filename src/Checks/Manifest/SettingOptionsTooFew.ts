import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { JsonObject } from "../../Types/LoaderTypes.js";
import type { Pack } from "../../Types/ModelTypes.js";
import JsonLoader from "../../Loaders/JsonLoader.js";
import ManifestLoader from "../../Loaders/ManifestLoader.js";
import ManifestCheck from "./ManifestCheck.js";
import ManifestChecks from "./ManifestChecks.js";
import ManifestLimits from "./ManifestLimits.js";

export default class SettingOptionsTooFew extends ManifestCheck {
    readonly definition: CheckDefinition = {
        group: ManifestChecks.GROUP,
        number: ManifestChecks.SETTING_OPTIONS_TOO_FEW,
        slug: "setting-options-too-few",
        severity: "error",
        description: "Dropdown has fewer than " + ManifestLimits.DROPDOWN_MIN_OPTIONS + " options",
    };

    protected async checkManifest(_context: CheckContext, pack: Pack, manifest: JsonObject): Promise<Finding[]> {
        const findings: Finding[] = [];

        ManifestLoader.settings(manifest).forEach((setting, index) => {
            if (setting.type !== "dropdown" || !JsonLoader.isArray(setting.options)) {
                return;
            }

            if (setting.options.length >= ManifestLimits.DROPDOWN_MIN_OPTIONS) {
                return;
            }

            const field = "settings[" + index + "].options";
            const message = "dropdown has " + setting.options.length + " options, expected at least " + ManifestLimits.DROPDOWN_MIN_OPTIONS;

            findings.push(this.manifestFinding(pack, message, field));
        });

        return findings;
    }
}
