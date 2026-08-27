import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import SkinPackLoader from "../../Loaders/SkinPackLoader.js";
import Check from "../Check.js";
import SkinChecks from "./SkinChecks.js";
import SkinLimits from "./SkinLimits.js";

export default class SkinNameInvalid extends Check {
    readonly definition: CheckDefinition = {
        group: SkinChecks.GROUP,
        number: SkinChecks.SKIN_NAME_INVALID,
        slug: "skin-name-invalid",
        severity: "error",
        description: "Skin localization_name has a digit or underscore",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const definition of await SkinPackLoader.load(context)) {
            for (const skin of definition.skins) {
                if (skin.localizationName === undefined || !SkinLimits.SKIN_NAME_FORBIDDEN.test(skin.localizationName)) {
                    continue;
                }

                findings.push(
                    this.finding(
                        "Skin localization_name " + skin.localizationName + " contains a digit or underscore",
                        definition.path,
                        definition.pack.root,
                        { field: skin.field + ".localization_name" }
                    )
                );
            }
        }

        return findings;
    }
}
