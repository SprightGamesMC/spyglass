import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import JsonLoader from "../../Loaders/JsonLoader.js";
import Check from "../Check.js";
import PackReferenceFiles from "./PackReferenceFiles.js";
import WorldChecks from "./WorldChecks.js";

export default class PackReferencesInvalid extends Check {
    readonly definition: CheckDefinition = {
        group: WorldChecks.GROUP,
        number: WorldChecks.PACK_REFERENCES_INVALID,
        slug: "pack-references-invalid",
        severity: "error",
        description: "Pack references file is not an array of objects",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const item of PackReferenceFiles.items(context)) {
            const result = await context.loaders.json.read(item.path);

            if (result.status !== "ok") {
                continue;
            }

            if (!JsonLoader.isArray(result.value)) {
                findings.push(this.finding("Pack references file is not an array", item.path));
                continue;
            }

            result.value.forEach((entry, index) => {
                if (JsonLoader.isObject(entry)) {
                    return;
                }

                findings.push(
                    this.finding("Pack reference at index " + index + " is not an object", item.path, undefined, {
                        field: "[" + index + "]",
                    })
                );
            });
        }

        return findings;
    }
}
