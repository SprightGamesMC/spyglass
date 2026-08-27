import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import Check from "../Check.js";
import PersonaChecks from "./PersonaChecks.js";

export default class MetaFileMissing extends Check {
    readonly definition: CheckDefinition = {
        group: PersonaChecks.GROUP,
        number: PersonaChecks.META_FILE_MISSING,
        slug: "meta-file-missing",
        severity: "error",
        description: "Pack has no .meta.json",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const data of await PersonaLoader.packs(context)) {
            if (data.metaPaths.length > 0) {
                continue;
            }

            findings.push(this.finding("Pack has no .meta.json file", data.pack.manifestPath, data.pack.root));
        }

        return findings;
    }
}
