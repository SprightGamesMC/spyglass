import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import ManifestLoader from "../../Loaders/ManifestLoader.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import Check from "../Check.js";
import PackReferenceFiles from "./PackReferenceFiles.js";
import WorldChecks from "./WorldChecks.js";

export default class PackReferenceNotFound extends Check {
    readonly definition: CheckDefinition = {
        group: WorldChecks.GROUP,
        number: WorldChecks.PACK_REFERENCE_NOT_FOUND,
        slug: "pack-reference-not-found",
        severity: "error",
        description: "pack_id does not match any pack",
    };

    private static async collectPackUuids(context: CheckContext): Promise<Set<string>> {
        const uuids = new Set<string>();

        for (const pack of PackItemLoader.contentPacks(context.model)) {
            const uuid = ManifestLoader.headerUuid(await ManifestLoader.read(context.loaders, pack));

            if (uuid !== undefined) {
                uuids.add(uuid.toLowerCase());
            }
        }

        return uuids;
    }

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];
        const knownUuids = await PackReferenceNotFound.collectPackUuids(context);

        for (const item of PackReferenceFiles.items(context)) {
            for (const { index, entry } of await PackReferenceFiles.readObjectEntries(context, item)) {
                const packId = entry.pack_id;

                if (!ManifestLoader.isValidUuid(packId) || knownUuids.has(packId.toLowerCase())) {
                    continue;
                }

                findings.push(
                    this.finding("pack_id " + packId + " does not match any behavior or resource pack", item.path, undefined, {
                        field: PackReferenceFiles.entryField(index, "pack_id"),
                    })
                );
            }
        }

        return findings;
    }
}
