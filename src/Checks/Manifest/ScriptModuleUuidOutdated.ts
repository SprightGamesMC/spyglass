import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { JsonObject } from "../../Types/LoaderTypes.js";
import type { Pack } from "../../Types/ModelTypes.js";
import ManifestLoader from "../../Loaders/ManifestLoader.js";
import ManifestCheck from "./ManifestCheck.js";
import ManifestChecks from "./ManifestChecks.js";
import ManifestLimits from "./ManifestLimits.js";

export default class ScriptModuleUuidOutdated extends ManifestCheck {
    readonly definition: CheckDefinition = {
        group: ManifestChecks.GROUP,
        number: ManifestChecks.SCRIPT_MODULE_UUID_OUTDATED,
        slug: "script-module-uuid-outdated",
        severity: "warning",
        description: "Script module dependency declared by uuid instead of module_name",
    };

    private static moduleName(uuid: string): string | undefined {
        const key = uuid.toLowerCase();

        return Object.hasOwn(ManifestLimits.SCRIPT_MODULE_UUIDS, key) ? ManifestLimits.SCRIPT_MODULE_UUIDS[key] : undefined;
    }

    protected async checkManifest(_context: CheckContext, pack: Pack, manifest: JsonObject): Promise<Finding[]> {
        const findings: Finding[] = [];

        ManifestLoader.dependencies(manifest).forEach((dependency, index) => {
            const uuid = dependency.uuid;

            if (typeof uuid !== "string") {
                return;
            }

            const moduleName = ScriptModuleUuidOutdated.moduleName(uuid);

            if (moduleName === undefined) {
                return;
            }

            const field = "dependencies[" + index + "].uuid";
            const message = "uuid " + uuid + " is the outdated form of script module " + moduleName + ", use module_name";

            findings.push(this.manifestFinding(pack, message, field));
        });

        return findings;
    }
}
