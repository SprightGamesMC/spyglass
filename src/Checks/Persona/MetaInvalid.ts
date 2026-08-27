import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PersonaMetaSchema from "../../Data/Schemas/PersonaMetaSchema.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import SchemaValidator from "../../Loaders/SchemaValidator.js";
import Check from "../Check.js";
import PersonaChecks from "./PersonaChecks.js";

export default class MetaInvalid extends Check {
    readonly definition: CheckDefinition = {
        group: PersonaChecks.GROUP,
        number: PersonaChecks.META_INVALID,
        slug: "meta-invalid",
        severity: "error",
        description: "Meta does not match schema",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const data of await PersonaLoader.packs(context)) {
            if (data.meta === undefined || data.metaPath === undefined) {
                continue;
            }

            for (const issue of SchemaValidator.validate(data.meta, PersonaMetaSchema.SCHEMA)) {
                findings.push(this.finding(issue.message, data.metaPath, data.pack.root, { field: issue.path }));
            }
        }

        return findings;
    }
}
