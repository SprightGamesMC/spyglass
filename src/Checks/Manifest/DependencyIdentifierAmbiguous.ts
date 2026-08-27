import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { JsonObject } from "../../Types/LoaderTypes.js";
import type { Pack } from "../../Types/ModelTypes.js";
import ManifestLoader from "../../Loaders/ManifestLoader.js";
import ManifestCheck from "./ManifestCheck.js";
import ManifestChecks from "./ManifestChecks.js";

export default class DependencyIdentifierAmbiguous extends ManifestCheck {
    readonly definition: CheckDefinition = {
        group: ManifestChecks.GROUP,
        number: ManifestChecks.DEPENDENCY_IDENTIFIER_AMBIGUOUS,
        slug: "dependency-identifier-ambiguous",
        severity: "error",
        description: "Dependency has both module_name and uuid",
    };

    protected async checkManifest(_context: CheckContext, pack: Pack, manifest: JsonObject): Promise<Finding[]> {
        const findings: Finding[] = [];

        ManifestLoader.dependencies(manifest).forEach((dependency, index) => {
            const hasUuid = ManifestLoader.hasDependencyUuid(dependency);
            const hasModuleName = ManifestLoader.hasDependencyModuleName(dependency);

            if (!hasUuid || !hasModuleName) {
                return;
            }

            const field = "dependencies[" + index + "]";

            findings.push(this.manifestFinding(pack, field + " has both module_name and uuid, use one", field));
        });

        return findings;
    }
}
