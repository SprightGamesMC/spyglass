import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import EmoteAnimationLoader from "../../Loaders/EmoteAnimationLoader.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import Check from "../Check.js";
import EmoteChecks from "./EmoteChecks.js";

export default class AnimationFileNotFound extends Check {
    readonly definition: CheckDefinition = {
        group: EmoteChecks.GROUP,
        number: EmoteChecks.ANIMATION_FILE_NOT_FOUND,
        slug: "animation-file-not-found",
        severity: "error",
        description: "animationFile refers to a file not in the pack",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const data of await PersonaLoader.emotes(context)) {
            const source = PersonaLoader.animationSource(data.meta);
            const fileName = EmoteAnimationLoader.animationFileName(data);

            if (source === undefined || fileName === undefined || data.metaPath === undefined) {
                continue;
            }

            if (PersonaLoader.findItem(data.pack, fileName) !== undefined) {
                continue;
            }

            findings.push(
                this.finding("animationFile " + fileName + " is not in the pack", data.metaPath, data.pack.root, {
                    field: source.field + ".animationFile",
                })
            );
        }

        return findings;
    }
}
