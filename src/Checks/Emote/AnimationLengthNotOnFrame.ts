import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import EmoteAnimationLoader from "../../Loaders/EmoteAnimationLoader.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import Check from "../Check.js";
import EmoteChecks from "./EmoteChecks.js";
import EmoteSampler from "./EmoteSampler.js";

export default class AnimationLengthNotOnFrame extends Check {
    readonly definition: CheckDefinition = {
        group: EmoteChecks.GROUP,
        number: EmoteChecks.ANIMATION_LENGTH_NOT_ON_FRAME,
        slug: "animation-length-not-on-frame",
        severity: "warning",
        description: "Animation length is not within 0.0005 seconds of a multiple of 1/24 second",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const data of await PersonaLoader.emotes(context)) {
            const file = await EmoteAnimationLoader.load(context, data);

            if (file === undefined) {
                continue;
            }

            for (const [name, animation] of file.animations) {
                const length = animation.animation_length;

                if (typeof length !== "number" || EmoteSampler.isOnFrame(length)) {
                    continue;
                }

                findings.push(
                    this.finding("Animation " + name + " length of " + length + " seconds is not on a frame", file.path, data.pack.root, {
                        field: "animations." + name + ".animation_length",
                    })
                );
            }
        }

        return findings;
    }
}
