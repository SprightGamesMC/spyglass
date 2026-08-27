import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import Check from "../Check.js";
import MarketplaceChecks from "./MarketplaceChecks.js";
import WorldPackReferences from "./WorldPackReferences.js";

export default class WorldPackReferenceFileMissing extends Check {
    readonly definition: CheckDefinition = {
        group: MarketplaceChecks.GROUP,
        number: MarketplaceChecks.WORLD_PACK_REFERENCE_FILE_MISSING,
        slug: "world-pack-reference-file-missing",
        severity: "error",
        description: "World template has a pack but no matching pack reference file",
        contentTypes: ["world"],
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const reference of WorldPackReferences.collect(context.model)) {
            if (reference.path !== undefined) {
                continue;
            }

            findings.push(
                this.finding(
                    "Pack " + reference.pack.root + " is inside the world template but " + reference.expectedPath + " does not exist",
                    reference.expectedPath,
                    reference.pack.root
                )
            );
        }

        return findings;
    }
}
