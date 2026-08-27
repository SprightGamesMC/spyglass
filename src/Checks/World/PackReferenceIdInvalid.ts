import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import ManifestLoader from "../../Loaders/ManifestLoader.js";
import Check from "../Check.js";
import PackReferenceFiles from "./PackReferenceFiles.js";
import WorldChecks from "./WorldChecks.js";

export default class PackReferenceIdInvalid extends Check {
    readonly definition: CheckDefinition = {
        group: WorldChecks.GROUP,
        number: WorldChecks.PACK_REFERENCE_ID_INVALID,
        slug: "pack-reference-id-invalid",
        severity: "error",
        description: "pack_id missing or not a valid uuid",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const item of PackReferenceFiles.items(context)) {
            for (const { index, entry } of await PackReferenceFiles.readObjectEntries(context, item)) {
                const packId = entry.pack_id;
                const field = PackReferenceFiles.entryField(index, "pack_id");

                if (packId === undefined) {
                    findings.push(this.finding("Pack reference at index " + index + " has no pack_id", item.path, undefined, { field }));
                    continue;
                }

                if (ManifestLoader.isValidUuid(packId)) {
                    continue;
                }

                findings.push(this.finding("pack_id " + JSON.stringify(packId) + " is not a valid uuid", item.path, undefined, { field }));
            }
        }

        return findings;
    }
}
