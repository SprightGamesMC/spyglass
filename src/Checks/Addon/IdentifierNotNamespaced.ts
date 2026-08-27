import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import Check from "../Check.js";
import AddonChecks from "./AddonChecks.js";
import AddonIdentifiers from "./AddonIdentifiers.js";
import AddonNaming from "./AddonNaming.js";

export default class IdentifierNotNamespaced extends Check {
    readonly definition: CheckDefinition = {
        group: AddonChecks.GROUP,
        number: AddonChecks.IDENTIFIER_NOT_NAMESPACED,
        slug: "identifier-not-namespaced",
        severity: "error",
        description: "Animation, controller, or geometry id is not namespaced",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const entry of await AddonIdentifiers.collect(context)) {
            if (!AddonIdentifiers.hasPrefixForm(entry.identifier, entry.prefix)) {
                continue;
            }

            const segment = AddonIdentifiers.namespaceSegment(entry.identifier, entry.prefix);

            if (AddonNaming.isNamespaced(segment)) {
                continue;
            }

            findings.push(
                this.finding(
                    "Identifier " + entry.identifier + " segment " + segment + " is not in creatorshortname_projectshortname form",
                    entry.item.item.path,
                    entry.item.pack.root,
                    { field: entry.field }
                )
            );
        }

        return findings;
    }
}
