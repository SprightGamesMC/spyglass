import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import EmoteAnimationLoader from "../../Loaders/EmoteAnimationLoader.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import Check from "../Check.js";
import EmoteChecks from "./EmoteChecks.js";
import EmoteSampler from "./EmoteSampler.js";

export default class KeyframeNotOnFrame extends Check {
    readonly definition: CheckDefinition = {
        group: EmoteChecks.GROUP,
        number: EmoteChecks.KEYFRAME_NOT_ON_FRAME,
        slug: "keyframe-not-on-frame",
        severity: "warning",
        description: "Keyframe time is not within 0.0005 seconds of a multiple of 1/24 second",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const data of await PersonaLoader.emotes(context)) {
            const file = await EmoteAnimationLoader.load(context, data);

            if (file === undefined) {
                continue;
            }

            for (const [name, animation] of file.animations) {
                for (const [bone, definition] of EmoteAnimationLoader.bones(animation)) {
                    for (const channel of EmoteAnimationLoader.CHANNELS) {
                        for (const keyframe of EmoteAnimationLoader.keyframes(definition, channel)) {
                            if (EmoteSampler.isOnFrame(keyframe.time)) {
                                continue;
                            }

                            findings.push(
                                this.finding(
                                    "Bone " + bone + " " + channel + " keyframe at " + keyframe.time + " seconds is not on a frame",
                                    file.path,
                                    data.pack.root,
                                    { field: "animations." + name + ".bones." + bone + "." + channel + "." + keyframe.time }
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
