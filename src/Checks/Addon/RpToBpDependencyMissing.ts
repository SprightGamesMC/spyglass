import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import ManifestLoader from "../../Loaders/ManifestLoader.js";
import Check from "../Check.js";
import AddonChecks from "./AddonChecks.js";
import AddonManifests from "./AddonManifests.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";

export default class RpToBpDependencyMissing extends Check {
    readonly definition: CheckDefinition = {
        group: AddonChecks.GROUP,
        number: AddonChecks.RP_TO_BP_DEPENDENCY_MISSING,
        slug: "rp-to-bp-dependency-missing",
        severity: "error",
        description: "Resource pack does not depend on the behavior pack",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const entry of await AddonManifests.valid(context, PackItemLoader.RESOURCE_PACK_TYPE)) {
            if (ManifestLoader.dependencies(entry.manifest).length > 0) {
                continue;
            }

            findings.push(
                this.finding(
                    "Resource pack manifest has no dependency, expected one on the behavior pack",
                    entry.pack.manifestPath,
                    entry.pack.root,
                    { field: "dependencies" }
                )
            );
        }

        return findings;
    }
}
