import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import ManifestLoader from "../../Loaders/ManifestLoader.js";
import Check from "../Check.js";
import MarketplaceChecks from "./MarketplaceChecks.js";
import WorldPackReferences from "./WorldPackReferences.js";

export default class PackNotReferenced extends Check {
    readonly definition: CheckDefinition = {
        group: MarketplaceChecks.GROUP,
        number: MarketplaceChecks.PACK_NOT_REFERENCED,
        slug: "pack-not-referenced",
        severity: "error",
        description: "Pack inside a world template is not listed in its pack reference file",
        contentTypes: ["world"],
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const reference of WorldPackReferences.collect(context.model)) {
            if (reference.path === undefined) {
                continue;
            }

            const manifest = await ManifestLoader.read(context.loaders, reference.pack);
            const uuid = ManifestLoader.headerUuid(manifest);

            if (uuid === undefined) {
                continue;
            }

            const entries = await WorldPackReferences.entries(context.loaders, reference.path);

            if (WorldPackReferences.findEntry(entries, uuid) !== undefined) {
                continue;
            }

            findings.push(
                this.finding(
                    "Pack " + reference.pack.root + " with uuid " + uuid + " is not listed in " + reference.path,
                    reference.path,
                    reference.pack.root
                )
            );
        }

        return findings;
    }
}
