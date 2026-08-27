import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import EmoteAnimationLoader from "../../Loaders/EmoteAnimationLoader.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import PersonaFormatVersionCheck from "../Common/PersonaFormatVersionCheck.js";
import EmoteChecks from "./EmoteChecks.js";
import EmoteLimits from "./EmoteLimits.js";

export default class AnimationFormatVersionInvalid extends PersonaFormatVersionCheck {
    readonly definition: CheckDefinition = {
        group: EmoteChecks.GROUP,
        number: EmoteChecks.ANIMATION_FORMAT_VERSION_INVALID,
        slug: "animation-format-version-invalid",
        severity: "error",
        description: "Animation file format_version is not 1.8.0",
    };
    protected readonly label = "Animation";
    protected readonly expectedVersion = EmoteLimits.ANIMATION_FORMAT_VERSION;

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const data of await PersonaLoader.emotes(context)) {
            const file = await EmoteAnimationLoader.load(context, data);

            if (file === undefined) {
                continue;
            }

            const finding = this.formatVersionFinding(file.root, file.path, data.pack.root);

            if (finding !== undefined) {
                findings.push(finding);
            }
        }

        return findings;
    }
}
