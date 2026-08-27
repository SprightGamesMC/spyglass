import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import Check from "../Check.js";
import PersonaChecks from "./PersonaChecks.js";

export default class MultipleMetaFiles extends Check {
    readonly definition: CheckDefinition = {
        group: PersonaChecks.GROUP,
        number: PersonaChecks.MULTIPLE_META_FILES,
        slug: "multiple-meta-files",
        severity: "error",
        description: "More than one .meta.json in the pack",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const data of await PersonaLoader.packs(context)) {
            if (data.metaPaths.length < 2) {
                continue;
            }

            for (const path of data.metaPaths.slice(1)) {
                findings.push(this.finding("Pack has " + data.metaPaths.length + " .meta.json files, expected 1", path, data.pack.root));
            }
        }

        return findings;
    }
}
