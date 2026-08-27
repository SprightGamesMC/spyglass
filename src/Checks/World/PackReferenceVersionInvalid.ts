import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import Check from "../Check.js";
import PackReferenceFiles from "./PackReferenceFiles.js";
import WorldChecks from "./WorldChecks.js";

export default class PackReferenceVersionInvalid extends Check {
    readonly definition: CheckDefinition = {
        group: WorldChecks.GROUP,
        number: WorldChecks.PACK_REFERENCE_VERSION_INVALID,
        slug: "pack-reference-version-invalid",
        severity: "error",
        description: "Pack reference version missing or malformed",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const item of PackReferenceFiles.items(context)) {
            for (const { index, entry } of await PackReferenceFiles.readObjectEntries(context, item)) {
                const version = entry.version;
                const field = PackReferenceFiles.entryField(index, "version");

                if (version === undefined) {
                    findings.push(this.finding("Pack reference at index " + index + " has no version", item.path, undefined, { field }));
                    continue;
                }

                if (PackReferenceFiles.isValidVersion(version)) {
                    continue;
                }

                findings.push(
                    this.finding(
                        "Pack reference version " + JSON.stringify(version) + " is not a three number array or a version string",
                        item.path,
                        undefined,
                        { field }
                    )
                );
            }
        }

        return findings;
    }
}
