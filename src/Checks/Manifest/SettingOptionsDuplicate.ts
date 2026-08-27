import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { JsonObject } from "../../Types/LoaderTypes.js";
import type { Pack } from "../../Types/ModelTypes.js";
import ManifestLoader from "../../Loaders/ManifestLoader.js";
import ManifestCheck from "./ManifestCheck.js";
import ManifestChecks from "./ManifestChecks.js";

export default class SettingOptionsDuplicate extends ManifestCheck {
    readonly definition: CheckDefinition = {
        group: ManifestChecks.GROUP,
        number: ManifestChecks.SETTING_OPTIONS_DUPLICATE,
        slug: "setting-options-duplicate",
        severity: "error",
        description: "Dropdown has repeated option names",
    };

    protected async checkManifest(_context: CheckContext, pack: Pack, manifest: JsonObject): Promise<Finding[]> {
        const findings: Finding[] = [];

        ManifestLoader.settings(manifest).forEach((setting, index) => {
            if (setting.type !== "dropdown") {
                return;
            }

            const names = ManifestLoader.optionNames(setting);
            const field = "settings[" + index + "].options";

            for (const name of this.duplicates(names)) {
                findings.push(this.manifestFinding(pack, "dropdown option " + name + " is used more than once", field));
            }
        });

        return findings;
    }
}
