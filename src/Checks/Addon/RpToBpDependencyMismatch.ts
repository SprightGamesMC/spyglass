import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import ManifestLoader from "../../Loaders/ManifestLoader.js";
import Check from "../Check.js";
import AddonChecks from "./AddonChecks.js";
import AddonManifests from "./AddonManifests.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";

export default class RpToBpDependencyMismatch extends Check {
    readonly definition: CheckDefinition = {
        group: AddonChecks.GROUP,
        number: AddonChecks.RP_TO_BP_DEPENDENCY_MISMATCH,
        slug: "rp-to-bp-dependency-mismatch",
        severity: "error",
        description: "Resource pack dependency uuid is not the behavior pack uuid",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const behaviorUuids = AddonManifests.headerUuids(await AddonManifests.valid(context, PackItemLoader.BEHAVIOR_PACK_TYPE));

        if (behaviorUuids.length === 0) {
            return [];
        }

        const findings: Finding[] = [];

        for (const entry of await AddonManifests.valid(context, PackItemLoader.RESOURCE_PACK_TYPE)) {
            const dependencies = ManifestLoader.dependencies(entry.manifest);

            if (dependencies.length !== 1) {
                continue;
            }

            const uuid = AddonManifests.dependencyUuid(dependencies[0]);

            if (uuid !== undefined && behaviorUuids.includes(uuid)) {
                continue;
            }

            findings.push(
                this.finding(
                    "Resource pack dependency uuid " + (uuid ?? "(missing)") + " is not the behavior pack uuid " + behaviorUuids.join(", "),
                    entry.pack.manifestPath,
                    entry.pack.root,
                    { field: AddonManifests.dependencyField(entry.manifest, dependencies[0]) }
                )
            );
        }

        return findings;
    }
}
