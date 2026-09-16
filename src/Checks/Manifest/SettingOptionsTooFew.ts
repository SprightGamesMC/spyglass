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
        description: "Dropdown or multiselect has fewer than " + ManifestLimits.OPTIONS_MINIMUM_COUNT + " options",
    };

    protected async checkManifest(_context: CheckContext, pack: Pack, manifest: JsonObject): Promise<Finding[]> {
        const findings: Finding[] = [];

        ManifestLoader.settings(manifest).forEach((setting, index) => {
            if (typeof setting.type !== "string" || !ManifestLimits.OPTION_SETTING_TYPES.includes(setting.type)) {
                return;
            }

            if (!JsonLoader.isArray(setting.options) || setting.options.length >= ManifestLimits.OPTIONS_MINIMUM_COUNT) {
                return;
            }

            const field = "settings[" + index + "].options";
            const message =
                setting.type + " has " + setting.options.length + " options, expected at least " + ManifestLimits.OPTIONS_MINIMUM_COUNT;

            findings.push(this.manifestFinding(pack, message, field));
        });

        return findings;
    }
}
