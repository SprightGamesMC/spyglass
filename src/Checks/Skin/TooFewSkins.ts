import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import SkinPackLoader from "../../Loaders/SkinPackLoader.js";
import Check from "../Check.js";
import SkinChecks from "./SkinChecks.js";
import SkinLimits from "./SkinLimits.js";

export default class TooFewSkins extends Check {
    readonly definition: CheckDefinition = {
        group: SkinChecks.GROUP,
        number: SkinChecks.TOO_FEW_SKINS,
        slug: "too-few-skins",
        severity: "error",
        description: "Fewer than " + SkinLimits.SKIN_COUNT_MINIMUM + " skins",
        excludedContentTypes: ["world"],
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const definition of await SkinPackLoader.load(context)) {
            const count = definition.skins.length;

            if (count >= SkinLimits.SKIN_COUNT_MINIMUM) {
                continue;
            }

            findings.push(
                this.finding(
                    "skins.json has " + count + " skins, the minimum is " + SkinLimits.SKIN_COUNT_MINIMUM,
                    definition.path,
                    definition.pack.root,
                    { field: "skins" }
                )
            );
        }

        return findings;
    }
}
