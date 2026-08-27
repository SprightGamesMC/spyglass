import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import ManifestStructureLoader from "../../Loaders/ManifestStructureLoader.js";
import Check from "../Check.js";
import ManifestChecks from "./ManifestChecks.js";

export default class SchemaInvalid extends Check {
    readonly definition: CheckDefinition = {
        group: ManifestChecks.GROUP,
        number: ManifestChecks.SCHEMA_INVALID,
        slug: "schema-invalid",
        severity: "error",
        description: "Manifest structure does not match the manifest schema",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const pack of context.model.packs) {
            const result = await ManifestStructureLoader.validate(context.loaders, pack);

            if (result.status !== "invalid") {
                continue;
            }

            for (const issue of result.issues) {
                findings.push(this.finding(issue.message, pack.manifestPath, pack.root, { field: issue.path }));
            }
        }

        return findings;
    }
}
