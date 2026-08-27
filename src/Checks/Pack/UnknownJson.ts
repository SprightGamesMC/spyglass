import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import Check from "../Check.js";
import PackChecks from "./PackChecks.js";

export default class UnknownJson extends Check {
    readonly definition: CheckDefinition = {
        group: PackChecks.GROUP,
        number: PackChecks.UNKNOWN_JSON,
        slug: "unknown-json",
        severity: "error",
        description: "JSON file in a location the tool cannot classify",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const pack of context.model.packs) {
            for (const item of pack.items) {
                if (item.kind !== "json_unknown") {
                    continue;
                }

                findings.push(this.finding("JSON file " + item.packPath + " does not match any known file type", item.path, pack.root));
            }
        }

        return findings;
    }
}
