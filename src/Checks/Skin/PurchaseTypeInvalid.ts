import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import SkinPackLoader from "../../Loaders/SkinPackLoader.js";
import Check from "../Check.js";
import SkinChecks from "./SkinChecks.js";
import SkinLimits from "./SkinLimits.js";

export default class PurchaseTypeInvalid extends Check {
    readonly definition: CheckDefinition = {
        group: SkinChecks.GROUP,
        number: SkinChecks.PURCHASE_TYPE_INVALID,
        slug: "purchase-type-invalid",
        severity: "error",
        description: "Skin type is not free or paid",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const definition of await SkinPackLoader.load(context)) {
            for (const skin of definition.skins) {
                if (skin.type === undefined || SkinLimits.ALLOWED_PURCHASE_TYPES.includes(skin.type)) {
                    continue;
                }

                findings.push(
                    this.finding(
                        "Skin type " + skin.type + " is not allowed, expected " + SkinLimits.ALLOWED_PURCHASE_TYPES.join(" or "),
                        definition.path,
                        definition.pack.root,
                        { field: skin.field + ".type" }
                    )
                );
            }
        }

        return findings;
    }
}
