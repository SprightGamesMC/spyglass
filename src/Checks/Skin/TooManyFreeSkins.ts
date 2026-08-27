import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import SkinPackLoader from "../../Loaders/SkinPackLoader.js";
import Check from "../Check.js";
import SkinChecks from "./SkinChecks.js";
import SkinLimits from "./SkinLimits.js";

export default class TooManyFreeSkins extends Check {
    readonly definition: CheckDefinition = {
        group: SkinChecks.GROUP,
        number: SkinChecks.TOO_MANY_FREE_SKINS,
        slug: "too-many-free-skins",
        severity: "error",
        description: "More than " + SkinLimits.FREE_SKIN_COUNT_LIMIT + " free skins",
        excludedContentTypes: ["world"],
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const definition of await SkinPackLoader.load(context)) {
            const count = definition.skins.filter((skin) => skin.type === SkinLimits.FREE_PURCHASE_TYPE).length;

            if (count <= SkinLimits.FREE_SKIN_COUNT_LIMIT) {
                continue;
            }

            findings.push(
                this.finding(
                    "skins.json has " + count + " free skins, the limit is " + SkinLimits.FREE_SKIN_COUNT_LIMIT,
                    definition.path,
                    definition.pack.root,
                    { field: "skins" }
                )
            );
        }

        return findings;
    }
}
