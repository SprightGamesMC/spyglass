import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { EmoteKeyframe } from "../../Types/PersonaTypes.js";
import EmoteAnimationLoader from "../../Loaders/EmoteAnimationLoader.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import Check from "../Check.js";
import EmoteChecks from "./EmoteChecks.js";
import EmoteLimits from "./EmoteLimits.js";

export default class BoneScaleOverLimit extends Check {
    readonly definition: CheckDefinition = {
        group: EmoteChecks.GROUP,
        number: EmoteChecks.BONE_SCALE_OVER_LIMIT,
        slug: "bone-scale-over-limit",
        severity: "error",
        description: "Bone scale is outside 0.85 to 1.15 or not uniform",
    };

    private static problem(keyframe: EmoteKeyframe): string | undefined {
        for (const scale of [keyframe.pre, keyframe.post]) {
            if (scale === undefined) {
                continue;
            }

            if (scale.some((component) => component !== scale[0])) {
                return "scale " + EmoteAnimationLoader.formatVector(scale) + " is not uniform";
            }

            if (scale[0] < EmoteLimits.SCALE_MIN || scale[0] > EmoteLimits.SCALE_MAX) {
                return "scale " + scale[0] + " is outside " + EmoteLimits.SCALE_MIN + " to " + EmoteLimits.SCALE_MAX;
            }
        }

        return undefined;
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
                    for (const keyframe of EmoteAnimationLoader.keyframes(definition, "scale")) {
                        const problem = BoneScaleOverLimit.problem(keyframe);

                        if (problem === undefined) {
                            continue;
                        }

                        findings.push(
                            this.finding("Bone " + bone + " at " + keyframe.time + " seconds: " + problem, file.path, data.pack.root, {
                                field: "animations." + name + ".bones." + bone + ".scale." + keyframe.time,
                            })
                        );
                    }
                }
            }
        }

        return findings;
    }
}
