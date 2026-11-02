import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { JsonObject } from "../../Types/LoaderTypes.js";
import type { EmoteChannel } from "../../Types/PersonaTypes.js";
import EmoteAnimationLoader from "../../Loaders/EmoteAnimationLoader.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import Check from "../Check.js";
import EmoteChecks from "./EmoteChecks.js";
import EmoteLimits from "./EmoteLimits.js";

export default class EdgeKeyframeMissing extends Check {
    readonly definition: CheckDefinition = {
        group: EmoteChecks.GROUP,
        number: EmoteChecks.EDGE_KEYFRAME_MISSING,
        slug: "edge-keyframe-missing",
        severity: "warning",
        description: "Keyframed channel has no keyframe at time 0 or at the animation end",
    };

    private static missingTimes(bone: JsonObject, channel: EmoteChannel, end: number): number[] {
        const times = EmoteAnimationLoader.keyframes(bone, channel).map((keyframe) => keyframe.time);

        if (!EmoteAnimationLoader.isKeyframed(bone, channel) || times.length === 0) {
            return [];
        }

        return [...new Set([0, end])].filter((edge) => !times.some((time) => Math.abs(time - edge) <= EmoteLimits.FRAME_TIME_TOLERANCE));
    }

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const data of await PersonaLoader.emotes(context)) {
            const file = await EmoteAnimationLoader.load(context, data);

            if (file === undefined) {
                continue;
            }

            for (const [name, animation] of file.animations) {
                const end = EmoteAnimationLoader.animationEnd(animation);

                if (end === undefined) {
                    continue;
                }

                for (const [bone, definition] of EmoteAnimationLoader.bones(animation)) {
                    for (const channel of EmoteAnimationLoader.CHANNELS) {
                        for (const time of EdgeKeyframeMissing.missingTimes(definition, channel, end)) {
                            findings.push(
                                this.finding(
                                    "Bone " + bone + " " + channel + " has no keyframe at " + time + " seconds",
                                    file.path,
                                    data.pack.root,
                                    {
                                        field: "animations." + name + ".bones." + bone + "." + channel,
                                    }
                                )
                            );
                        }
                    }
                }
            }
        }

        return findings;
    }
}
