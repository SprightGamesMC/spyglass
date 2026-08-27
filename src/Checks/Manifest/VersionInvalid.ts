import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { JsonObject } from "../../Types/LoaderTypes.js";
import type { Pack } from "../../Types/ModelTypes.js";
import ManifestLoader from "../../Loaders/ManifestLoader.js";
import VersionUtilities from "../../Loaders/VersionUtilities.js";
import ManifestCheck from "./ManifestCheck.js";
import ManifestChecks from "./ManifestChecks.js";

export default class VersionInvalid extends ManifestCheck {
    readonly definition: CheckDefinition = {
        group: ManifestChecks.GROUP,
        number: ManifestChecks.VERSION_INVALID,
        slug: "version-invalid",
        severity: "error",
        description: "Dependency version cannot be parsed",
    };

    protected async checkManifest(_context: CheckContext, pack: Pack, manifest: JsonObject): Promise<Finding[]> {
        const findings: Finding[] = [];

        ManifestLoader.dependencies(manifest).forEach((dependency, index) => {
            if (VersionUtilities.parse(dependency.version) !== undefined) {
                return;
            }

            const field = "dependencies[" + index + "].version";
            const shown = dependency.version === undefined ? "is missing" : JSON.stringify(dependency.version) + " cannot be parsed";

            findings.push(this.manifestFinding(pack, field + " " + shown + ", expected [major, minor, patch] or a version string", field));
        });

        return findings;
    }
}
