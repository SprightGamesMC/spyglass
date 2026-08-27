import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import ManifestLoader from "../../Loaders/ManifestLoader.js";
import VersionUtilities from "../../Loaders/VersionUtilities.js";
import Check from "../Check.js";
import MarketplaceChecks from "./MarketplaceChecks.js";
import WorldPackReferences from "./WorldPackReferences.js";

export default class WorldPackReferenceMismatch extends Check {
    readonly definition: CheckDefinition = {
        group: MarketplaceChecks.GROUP,
        number: MarketplaceChecks.WORLD_PACK_REFERENCE_MISMATCH,
        slug: "world-pack-reference-mismatch",
        severity: "error",
        description: "Pack reference version does not match the pack manifest version",
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
            const version = ManifestLoader.headerVersion(manifest);

            if (uuid === undefined || version === undefined) {
                continue;
            }

            const entries = await WorldPackReferences.entries(context.loaders, reference.path);
            const entry = WorldPackReferences.findEntry(entries, uuid);

            if (entry === undefined) {
                continue;
            }

            const referenced = VersionUtilities.parse(entry.entry.version);

            if (referenced !== undefined && ManifestLoader.versionsEqual(referenced, version)) {
                continue;
            }

            const actual = referenced === undefined ? JSON.stringify(entry.entry.version) : VersionUtilities.format(referenced);

            findings.push(
                this.finding(
                    "Reference version " +
                        actual +
                        " does not match manifest version " +
                        VersionUtilities.format(version) +
                        " of " +
                        reference.pack.root,
                    reference.path,
                    reference.pack.root,
                    { field: "[" + entry.index + "].version" }
                )
            );
        }

        return findings;
    }
}
