import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import Check from "../Check.js";
import AddonChecks from "./AddonChecks.js";
import AddonManifests from "./AddonManifests.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";

export default class BpToRpDependencyMismatch extends Check {
    readonly definition: CheckDefinition = {
        group: AddonChecks.GROUP,
        number: AddonChecks.BP_TO_RP_DEPENDENCY_MISMATCH,
        slug: "bp-to-rp-dependency-mismatch",
        severity: "error",
        description: "Behavior pack dependency uuid is not the resource pack uuid",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const resourceUuids = AddonManifests.headerUuids(await AddonManifests.valid(context, PackItemLoader.RESOURCE_PACK_TYPE));

        if (resourceUuids.length === 0) {
            return [];
        }

        const findings: Finding[] = [];

        for (const entry of await AddonManifests.valid(context, PackItemLoader.BEHAVIOR_PACK_TYPE)) {
            const dependencies = AddonManifests.nonScriptDependencies(entry.manifest);

            if (dependencies.length !== 1) {
                continue;
            }

            const uuid = AddonManifests.dependencyUuid(dependencies[0]);

            if (uuid !== undefined && resourceUuids.includes(uuid)) {
                continue;
            }

            findings.push(
                this.finding(
                    "Behavior pack dependency uuid " + (uuid ?? "(missing)") + " is not the resource pack uuid " + resourceUuids.join(", "),
                    entry.pack.manifestPath,
                    entry.pack.root,
                    { field: AddonManifests.dependencyField(entry.manifest, dependencies[0]) }
                )
            );
        }

        return findings;
    }
}
