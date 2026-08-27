import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import JsonLoader from "../../Loaders/JsonLoader.js";
import Check from "../Check.js";
import AddonChecks from "./AddonChecks.js";
import AddonLimits from "./AddonLimits.js";
import AddonManifests from "./AddonManifests.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";

export default class ResourcePackScopeMissing extends Check {
    readonly definition: CheckDefinition = {
        group: AddonChecks.GROUP,
        number: AddonChecks.RESOURCE_PACK_SCOPE_MISSING,
        slug: "resource-pack-scope-missing",
        severity: "error",
        description: "Resource pack manifest pack_scope is missing or not world",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const entry of await AddonManifests.valid(context, PackItemLoader.RESOURCE_PACK_TYPE)) {
            const scope = JsonLoader.get(entry.manifest, "header", "pack_scope");

            if (scope === AddonLimits.EXPECTED_RESOURCE_PACK_SCOPE) {
                continue;
            }

            const actual = scope === undefined ? "missing" : String(scope);

            findings.push(
                this.finding(
                    "Resource pack header pack_scope is " + actual + ", expected " + AddonLimits.EXPECTED_RESOURCE_PACK_SCOPE,
                    entry.pack.manifestPath,
                    entry.pack.root,
                    { field: "header.pack_scope" }
                )
            );
        }

        return findings;
    }
}
