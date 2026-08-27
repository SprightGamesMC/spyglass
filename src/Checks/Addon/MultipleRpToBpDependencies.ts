import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import ManifestLoader from "../../Loaders/ManifestLoader.js";
import Check from "../Check.js";
import AddonChecks from "./AddonChecks.js";
import AddonManifests from "./AddonManifests.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";

export default class MultipleRpToBpDependencies extends Check {
    readonly definition: CheckDefinition = {
        group: AddonChecks.GROUP,
        number: AddonChecks.MULTIPLE_RP_TO_BP_DEPENDENCIES,
        slug: "multiple-rp-to-bp-dependencies",
        severity: "error",
        description: "Resource pack has more than one dependency",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const entry of await AddonManifests.valid(context, PackItemLoader.RESOURCE_PACK_TYPE)) {
            const count = ManifestLoader.dependencies(entry.manifest).length;

            if (count <= 1) {
                continue;
            }

            findings.push(
                this.finding(
                    "Resource pack manifest has " + count + " dependencies, expected exactly one on the behavior pack",
                    entry.pack.manifestPath,
                    entry.pack.root,
                    { field: "dependencies" }
                )
            );
        }

        return findings;
    }
}
