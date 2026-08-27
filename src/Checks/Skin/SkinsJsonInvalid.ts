import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import SkinsSchema from "../../Data/Schemas/SkinsSchema.js";
import SchemaValidator from "../../Loaders/SchemaValidator.js";
import SkinPackLoader from "../../Loaders/SkinPackLoader.js";
import Check from "../Check.js";
import SkinChecks from "./SkinChecks.js";

export default class SkinsJsonInvalid extends Check {
    readonly definition: CheckDefinition = {
        group: SkinChecks.GROUP,
        number: SkinChecks.SKINS_JSON_INVALID,
        slug: "skins-json-invalid",
        severity: "error",
        description: "skins.json does not match schema",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const pack of SkinPackLoader.skinPacks(context)) {
            const item = SkinPackLoader.skinsJsonItem(pack);

            if (item === undefined) {
                continue;
            }

            const value = await context.loaders.json.readValue(item.path);

            if (value === undefined) {
                continue;
            }

            for (const issue of SchemaValidator.validate(value, SkinsSchema.SCHEMA)) {
                findings.push(this.finding(issue.message, item.path, pack.root, { field: issue.path }));
            }
        }

        return findings;
    }
}
