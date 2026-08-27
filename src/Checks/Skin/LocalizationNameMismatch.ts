import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import SkinPackLoader from "../../Loaders/SkinPackLoader.js";
import Check from "../Check.js";
import SkinChecks from "./SkinChecks.js";

export default class LocalizationNameMismatch extends Check {
    readonly definition: CheckDefinition = {
        group: SkinChecks.GROUP,
        number: SkinChecks.LOCALIZATION_NAME_MISMATCH,
        slug: "localization-name-mismatch",
        severity: "error",
        description: "localization_name and serialize_name differ",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const definition of await SkinPackLoader.load(context)) {
            if (definition.serializeName === undefined || definition.localizationName === undefined) {
                continue;
            }

            if (definition.serializeName === definition.localizationName) {
                continue;
            }

            findings.push(
                this.finding(
                    "localization_name " + definition.localizationName + " does not match serialize_name " + definition.serializeName,
                    definition.path,
                    definition.pack.root,
                    { field: "localization_name" }
                )
            );
        }

        return findings;
    }
}
