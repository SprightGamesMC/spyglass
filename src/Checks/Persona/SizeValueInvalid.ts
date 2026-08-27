import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import Check from "../Check.js";
import PersonaChecks from "./PersonaChecks.js";
import PersonaLimits from "./PersonaLimits.js";

export default class SizeValueInvalid extends Check {
    readonly definition: CheckDefinition = {
        group: PersonaChecks.GROUP,
        number: PersonaChecks.SIZE_VALUE_INVALID,
        slug: "size-value-invalid",
        severity: "error",
        description: "body_size, arm_size, or side is not a known value",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const data of await PersonaLoader.pieces(context)) {
            if (data.metaPath === undefined) {
                continue;
            }

            for (const source of PersonaLoader.geometrySources(data.meta)) {
                for (const [field, known] of Object.entries(PersonaLimits.SIZE_FIELDS)) {
                    const value = PersonaLoader.string(source.entry, field);

                    if (value === undefined || known.includes(value)) {
                        continue;
                    }

                    findings.push(
                        this.finding(field + " " + value + " is not one of " + known.join(", "), data.metaPath, data.pack.root, {
                            field: source.field + "." + field,
                        })
                    );
                }
            }
        }

        return findings;
    }
}
