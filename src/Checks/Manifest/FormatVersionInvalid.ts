import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { JsonObject } from "../../Types/LoaderTypes.js";
import type { Pack } from "../../Types/ModelTypes.js";
import JsonLoader from "../../Loaders/JsonLoader.js";
import ManifestCheck from "./ManifestCheck.js";
import ManifestChecks from "./ManifestChecks.js";
import ManifestLimits from "./ManifestLimits.js";

export default class FormatVersionInvalid extends ManifestCheck {
    readonly definition: CheckDefinition = {
        group: ManifestChecks.GROUP,
        number: ManifestChecks.FORMAT_VERSION_INVALID,
        slug: "format-version-invalid",
        severity: "error",
        description: "format_version is not 1, 2, or 3",
    };

    protected async checkManifest(_context: CheckContext, pack: Pack, manifest: JsonObject): Promise<Finding[]> {
        const value = JsonLoader.get(manifest, "format_version");
        const allowed = ManifestLimits.VALID_FORMAT_VERSIONS.join(", ");

        if (value === undefined) {
            return [this.manifestFinding(pack, "format_version is missing, expected one of " + allowed, "format_version")];
        }

        if (typeof value === "number" && ManifestLimits.VALID_FORMAT_VERSIONS.includes(value)) {
            return [];
        }

        return [this.manifestFinding(pack, "format_version " + String(value) + " is not one of " + allowed, "format_version")];
    }
}
