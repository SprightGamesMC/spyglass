import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { EmoteSample } from "../../Types/PersonaTypes.js";
import EmoteAnimationLoader from "../../Loaders/EmoteAnimationLoader.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import Check from "../Check.js";
import EmoteChecks from "./EmoteChecks.js";
import EmoteLimits from "./EmoteLimits.js";
import EmoteSampler from "./EmoteSampler.js";

export default class BoneScaleOverLimit extends Check {
    readonly definition: CheckDefinition = {
        group: EmoteChecks.GROUP,
        number: EmoteChecks.BONE_SCALE_OVER_LIMIT,
        slug: "bone-scale-over-limit",
        severity: "error",
        description: "Bone scale is outside 0.85 to 1.15 or not uniform",
    };

    private static problem(sample: EmoteSample): string | undefined {
        const scale = sample.value;
        const tolerance = EmoteSampler.tolerance(sample);

        if (sample.isKeyframe && scale.some((component) => component !== scale[0])) {
            return "scale " + EmoteAnimationLoader.formatVector(scale) + " is not uniform";
        }

        const outside = scale.find(
            (component) => component < EmoteLimits.SCALE_MIN - tolerance || component > EmoteLimits.SCALE_MAX + tolerance
        );

        if (outside === undefined) {
            return undefined;
        }

        return "scale " + EmoteSampler.rounded(outside) + " is outside " + EmoteLimits.SCALE_MIN + " to " + EmoteLimits.SCALE_MAX;
    }

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const data of await PersonaLoader.emotes(context)) {
            const file = await EmoteAnimationLoader.load(context, data);

            if (file === undefined) {
                continue;
            }

            for (const [name, animation] of file.animations) {
                for (const [bone, definition] of EmoteAnimationLoader.bones(animation)) {
                    const keyframes = EmoteAnimationLoader.keyframes(definition, "scale");

                    for (const failure of EmoteSampler.firstFailures(keyframes, BoneScaleOverLimit.problem)) {
                        const time = EmoteSampler.rounded(failure.time);

                        findings.push(
                            this.finding("Bone " + bone + " at " + time + " seconds: " + failure.problem, file.path, data.pack.root, {
                                field: "animations." + name + ".bones." + bone + ".scale." + time,
                            })
                        );
                    }
                }
            }
        }

        return findings;
    }
}
