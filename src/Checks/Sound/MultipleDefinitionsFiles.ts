import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import Check from "../Check.js";
import SoundChecks from "./SoundChecks.js";
import SoundLimits from "./SoundLimits.js";

export default class MultipleDefinitionsFiles extends Check {
    readonly definition: CheckDefinition = {
        group: SoundChecks.GROUP,
        number: SoundChecks.MULTIPLE_DEFINITIONS_FILES,
        slug: "multiple-definitions-files",
        severity: "error",
        description: "More than one sound_definitions.json in one pack",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const pack of context.model.packs) {
            const files = pack.items.filter((item) => SoundLimits.KINDS.includes(item.kind));

            for (const item of files.slice(1)) {
                findings.push(
                    this.finding(
                        "Pack has " + files.length + " sound_definitions.json files, first is " + files[0].path,
                        item.path,
                        pack.root
                    )
                );
            }
        }

        return findings;
    }
}
