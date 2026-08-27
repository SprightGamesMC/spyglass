import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import Check from "../Check.js";
import AddonChecks from "./AddonChecks.js";
import AddonIdentifiers from "./AddonIdentifiers.js";

export default class IdentifierFormInvalid extends Check {
    readonly definition: CheckDefinition = {
        group: AddonChecks.GROUP,
        number: AddonChecks.IDENTIFIER_FORM_INVALID,
        slug: "identifier-form-invalid",
        severity: "error",
        description: "Animation, controller, or geometry id has the wrong prefix form",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const entry of await AddonIdentifiers.collect(context)) {
            if (AddonIdentifiers.hasPrefixForm(entry.identifier, entry.prefix)) {
                continue;
            }

            findings.push(
                this.finding(
                    "Identifier " + entry.identifier + " is not in the form " + entry.prefix.label,
                    entry.item.item.path,
                    entry.item.pack.root,
                    { field: entry.field }
                )
            );
        }

        return findings;
    }
}
