import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import SkinPackLoader from "../../Loaders/SkinPackLoader.js";
import Check from "../Check.js";
import SkinChecks from "./SkinChecks.js";
import SkinLimits from "./SkinLimits.js";

export default class LocKeyWhitespace extends Check {
    readonly definition: CheckDefinition = {
        group: SkinChecks.GROUP,
        number: SkinChecks.LOC_KEY_WHITESPACE,
        slug: "loc-key-whitespace",
        severity: "error",
        description: ".lang value has leading or trailing spaces",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const pack of SkinPackLoader.skinPacks(context)) {
            for (const item of SkinPackLoader.langItems(pack)) {
                const entries = await context.loaders.text.readLangEntries(item.path);

                for (const [key, value] of entries ?? []) {
                    if (!SkinLimits.EDGE_WHITESPACE.test(value)) {
                        continue;
                    }

                    findings.push(this.finding("Value of " + key + " has leading or trailing spaces", item.path, pack.root));
                }
            }
        }

        return findings;
    }
}
