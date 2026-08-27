import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { JsonObject } from "../../Types/LoaderTypes.js";
import EmoteAnimationLoader from "../../Loaders/EmoteAnimationLoader.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import Check from "../Check.js";
import EmoteChecks from "./EmoteChecks.js";
import EmoteLimits from "./EmoteLimits.js";

export default class AnimationTooLong extends Check {
    readonly definition: CheckDefinition = {
        group: EmoteChecks.GROUP,
        number: EmoteChecks.ANIMATION_TOO_LONG,
        slug: "animation-too-long",
        severity: "error",
        description: "Animation is longer than 10 seconds",
    };

    private static lengthField(animation: JsonObject): string {
        return typeof animation.animation_length === "number" ? ".animation_length" : ".bones";
    }

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const data of await PersonaLoader.emotes(context)) {
            const file = await EmoteAnimationLoader.load(context, data);

            if (file === undefined) {
                continue;
            }

            for (const [name, animation] of file.animations) {
                const length = EmoteAnimationLoader.length(animation);

                if (length === undefined || length <= EmoteLimits.MAX_LENGTH_SECONDS) {
                    continue;
                }

                findings.push(
                    this.finding(
                        "Animation " + name + " is " + length + " seconds long, limit is " + EmoteLimits.MAX_LENGTH_SECONDS,
                        file.path,
                        data.pack.root,
                        { field: "animations." + name + AnimationTooLong.lengthField(animation) }
                    )
                );
            }
        }

        return findings;
    }
}
