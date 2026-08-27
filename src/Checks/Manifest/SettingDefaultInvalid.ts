import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { JsonObject } from "../../Types/LoaderTypes.js";
import type { Pack } from "../../Types/ModelTypes.js";
import JsonLoader from "../../Loaders/JsonLoader.js";
import ManifestLoader from "../../Loaders/ManifestLoader.js";
import ManifestCheck from "./ManifestCheck.js";
import ManifestChecks from "./ManifestChecks.js";

export default class SettingDefaultInvalid extends ManifestCheck {
    readonly definition: CheckDefinition = {
        group: ManifestChecks.GROUP,
        number: ManifestChecks.SETTING_DEFAULT_INVALID,
        slug: "setting-default-invalid",
        severity: "error",
        description: "Setting default outside its range or options",
    };

    protected async checkManifest(_context: CheckContext, pack: Pack, manifest: JsonObject): Promise<Finding[]> {
        const findings: Finding[] = [];

        ManifestLoader.settings(manifest).forEach((setting, index) => {
            const field = "settings[" + index + "].default";

            if (setting.type === "slider") {
                const message = this.checkSlider(setting);

                if (message !== undefined) {
                    findings.push(this.manifestFinding(pack, message, field));
                }

                return;
            }

            if (setting.type !== "dropdown") {
                return;
            }

            const message = this.checkDropdown(setting);

            if (message !== undefined) {
                findings.push(this.manifestFinding(pack, message, field));
            }
        });

        return findings;
    }

    private checkSlider(setting: JsonObject): string | undefined {
        if (setting.default === undefined || typeof setting.min !== "number" || typeof setting.max !== "number") {
            return undefined;
        }

        if (typeof setting.default !== "number") {
            return "slider default " + JSON.stringify(setting.default) + " is not a number";
        }

        if (setting.default >= setting.min && setting.default <= setting.max) {
            return undefined;
        }

        return "slider default " + setting.default + " is outside min " + setting.min + " to max " + setting.max;
    }

    private checkDropdown(setting: JsonObject): string | undefined {
        if (setting.default === undefined || !JsonLoader.isArray(setting.options)) {
            return undefined;
        }

        const names = ManifestLoader.optionNames(setting);

        if (typeof setting.default === "string" && names.includes(setting.default)) {
            return undefined;
        }

        return "dropdown default " + JSON.stringify(setting.default) + " is not one of the options " + names.join(", ");
    }
}
