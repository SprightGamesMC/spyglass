import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import Check from "../Check.js";
import AddonChecks from "./AddonChecks.js";
import AddonManifests from "./AddonManifests.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";

export default class BpToRpDependencyMissing extends Check {
    readonly definition: CheckDefinition = {
        group: AddonChecks.GROUP,
        number: AddonChecks.BP_TO_RP_DEPENDENCY_MISSING,
        slug: "bp-to-rp-dependency-missing",
        severity: "error",
        description: "Behavior pack does not depend on the resource pack",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const entry of await AddonManifests.valid(context, PackItemLoader.BEHAVIOR_PACK_TYPE)) {
            if (AddonManifests.nonScriptDependencies(entry.manifest).length > 0) {
                continue;
            }

            findings.push(
                this.finding(
                    "Behavior pack manifest has no pack dependency, expected one on the resource pack",
                    entry.pack.manifestPath,
                    entry.pack.root,
                    { field: "dependencies" }
                )
            );
        }

        return findings;
    }
}
