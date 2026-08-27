import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import EmoteAnimationLoader from "../../Loaders/EmoteAnimationLoader.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import Check from "../Check.js";
import EmoteChecks from "./EmoteChecks.js";
import EmoteLimits from "./EmoteLimits.js";

export default class AnimationFileNameInvalid extends Check {
    readonly definition: CheckDefinition = {
        group: EmoteChecks.GROUP,
        number: EmoteChecks.ANIMATION_FILE_NAME_INVALID,
        slug: "animation-file-name-invalid",
        severity: "error",
        description: "animationFile is not <id>.animation.json",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const data of await PersonaLoader.emotes(context)) {
            const pieceName = PersonaLoader.string(data.meta, "piece_name");
            const source = PersonaLoader.animationSource(data.meta);
            const fileName = EmoteAnimationLoader.animationFileName(data);

            if (pieceName === undefined || source === undefined || fileName === undefined || data.metaPath === undefined) {
                continue;
            }

            const expected = pieceName + EmoteLimits.ANIMATION_SUFFIX;

            if (fileName === expected) {
                continue;
            }

            findings.push(
                this.finding("animationFile " + fileName + " is not " + expected, data.metaPath, data.pack.root, {
                    field: source.field + ".animationFile",
                })
            );
        }

        return findings;
    }
}
