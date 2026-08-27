import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { JsonObject } from "../../Types/LoaderTypes.js";
import type { Pack } from "../../Types/ModelTypes.js";
import ManifestLoader from "../../Loaders/ManifestLoader.js";
import ManifestCheck from "./ManifestCheck.js";
import ManifestChecks from "./ManifestChecks.js";

export default class SettingNameDuplicate extends ManifestCheck {
    readonly definition: CheckDefinition = {
        group: ManifestChecks.GROUP,
        number: ManifestChecks.SETTING_NAME_DUPLICATE,
        slug: "setting-name-duplicate",
        severity: "error",
        description: "Two settings use the same name",
    };

    protected async checkManifest(_context: CheckContext, pack: Pack, manifest: JsonObject): Promise<Finding[]> {
        const names = ManifestLoader.settings(manifest)
            .map((setting) => setting.name)
            .filter((name): name is string => typeof name === "string");

        return this.duplicates(names).map((name) =>
            this.manifestFinding(pack, "setting name " + name + " is used more than once", "settings")
        );
    }
}
