import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import Check from "../Check.js";
import AddonChecks from "./AddonChecks.js";
import AddonManifests from "./AddonManifests.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";

export default class MultipleBpToRpDependencies extends Check {
    readonly definition: CheckDefinition = {
        group: AddonChecks.GROUP,
        number: AddonChecks.MULTIPLE_BP_TO_RP_DEPENDENCIES,
        slug: "multiple-bp-to-rp-dependencies",
        severity: "error",
        description: "Behavior pack has more than one pack dependency",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const entry of await AddonManifests.valid(context, PackItemLoader.BEHAVIOR_PACK_TYPE)) {
            const count = AddonManifests.nonScriptDependencies(entry.manifest).length;

            if (count <= 1) {
                continue;
            }

            findings.push(
                this.finding(
                    "Behavior pack manifest has " + count + " pack dependencies, expected exactly one on the resource pack",
                    entry.pack.manifestPath,
                    entry.pack.root,
                    { field: "dependencies" }
                )
            );
        }

        return findings;
    }
}
