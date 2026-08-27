import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { JsonObject } from "../../Types/LoaderTypes.js";
import type { Pack } from "../../Types/ModelTypes.js";
import ManifestLoader from "../../Loaders/ManifestLoader.js";
import ManifestCheck from "./ManifestCheck.js";
import ManifestChecks from "./ManifestChecks.js";
import ManifestLimits from "./ManifestLimits.js";

export default class SettingNameNotNamespaced extends ManifestCheck {
    readonly definition: CheckDefinition = {
        group: ManifestChecks.GROUP,
        number: ManifestChecks.SETTING_NAME_NOT_NAMESPACED,
        slug: "setting-name-not-namespaced",
        severity: "error",
        description: "Setting name has no namespace: prefix",
    };

    protected async checkManifest(_context: CheckContext, pack: Pack, manifest: JsonObject): Promise<Finding[]> {
        const findings: Finding[] = [];

        ManifestLoader.settings(manifest).forEach((setting, index) => {
            if (typeof setting.name !== "string" || ManifestLimits.NAMESPACE_PATTERN.test(setting.name)) {
                return;
            }

            const field = "settings[" + index + "].name";

            findings.push(this.manifestFinding(pack, "setting name " + setting.name + " has no namespace: prefix", field));
        });

        return findings;
    }
}
