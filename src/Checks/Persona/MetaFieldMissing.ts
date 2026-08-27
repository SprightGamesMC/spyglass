import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import Check from "../Check.js";
import PersonaChecks from "./PersonaChecks.js";
import PersonaLimits from "./PersonaLimits.js";

export default class MetaFieldMissing extends Check {
    readonly definition: CheckDefinition = {
        group: PersonaChecks.GROUP,
        number: PersonaChecks.META_FIELD_MISSING,
        slug: "meta-field-missing",
        severity: "error",
        description: "Meta lacks piece_id, piece_name, or piece_type",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const data of await PersonaLoader.packs(context)) {
            if (data.meta === undefined || data.metaPath === undefined) {
                continue;
            }

            for (const field of PersonaLimits.REQUIRED_META_FIELDS) {
                if (data.meta[field] !== undefined) {
                    continue;
                }

                findings.push(this.finding("Meta has no " + field, data.metaPath, data.pack.root, { field }));
            }
        }

        return findings;
    }
}
