import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { JsonObject, JsonValue } from "../../Types/LoaderTypes.js";
import type { Pack } from "../../Types/ModelTypes.js";
import JsonLoader from "../../Loaders/JsonLoader.js";
import ManifestLoader from "../../Loaders/ManifestLoader.js";
import ManifestCheck from "./ManifestCheck.js";
import ManifestChecks from "./ManifestChecks.js";

export default class UuidInvalid extends ManifestCheck {
    readonly definition: CheckDefinition = {
        group: ManifestChecks.GROUP,
        number: ManifestChecks.UUID_INVALID,
        slug: "uuid-invalid",
        severity: "error",
        description: "A uuid is not valid",
    };

    protected async checkManifest(_context: CheckContext, pack: Pack, manifest: JsonObject): Promise<Finding[]> {
        const findings: Finding[] = [];

        this.checkUuid(findings, pack, "header.uuid", JsonLoader.get(manifest, "header", "uuid"), true);

        ManifestLoader.modules(manifest).forEach((module, index) => {
            this.checkUuid(findings, pack, "modules[" + index + "].uuid", module.uuid, true);
        });

        ManifestLoader.dependencies(manifest).forEach((dependency, index) => {
            this.checkUuid(findings, pack, "dependencies[" + index + "].uuid", dependency.uuid, false);
        });

        return findings;
    }

    private checkUuid(findings: Finding[], pack: Pack, field: string, value: JsonValue | undefined, required: boolean): void {
        if (value === undefined) {
            if (required) {
                findings.push(this.manifestFinding(pack, field + " is missing", field));
            }

            return;
        }

        if (ManifestLoader.isValidUuid(value)) {
            return;
        }

        findings.push(this.manifestFinding(pack, field + " " + JSON.stringify(value) + " is not a valid uuid", field));
    }
}
