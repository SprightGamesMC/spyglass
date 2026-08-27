import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import Check from "../Check.js";
import PackChecks from "./PackChecks.js";
import PackLimits from "./PackLimits.js";

export default class ExperimentalTypeNotAllowed extends Check {
    readonly definition: CheckDefinition = {
        group: PackChecks.GROUP,
        number: PackChecks.EXPERIMENTAL_TYPE_NOT_ALLOWED,
        slug: "experimental-type-not-allowed",
        severity: "error",
        description: "File is an experimental definition type",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const pack of context.model.packs) {
            for (const item of pack.items) {
                if (!PackLimits.EXPERIMENTAL_KINDS.includes(item.kind)) {
                    continue;
                }

                findings.push(
                    this.finding("File " + item.packPath + " is an experimental " + item.kind + " definition", item.path, pack.root)
                );
            }
        }

        return findings;
    }
}
