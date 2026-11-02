import type { CheckContext, Finding } from "../../Types/CheckTypes.js";
import type { JsonObject } from "../../Types/LoaderTypes.js";
import type { EmoteChannel } from "../../Types/PersonaTypes.js";
import EmoteAnimationLoader from "../../Loaders/EmoteAnimationLoader.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import Check from "../Check.js";
import EmoteLimits from "./EmoteLimits.js";

export default abstract class NonNumericChannelCheck extends Check {
    protected abstract readonly coversLimitedChannels: boolean;

    private static isLimited(bone: string, channel: EmoteChannel): boolean {
        return channel === "scale" || (channel === "position" && bone === EmoteLimits.ROOT_BONE);
    }

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const data of await PersonaLoader.emotes(context)) {
            const file = await EmoteAnimationLoader.load(context, data);

            if (file === undefined) {
                continue;
            }

            for (const [name, animation] of file.animations) {
                findings.push(...this.inspectAnimation(name, animation, file.path, data.pack.root));
            }
        }

        return findings;
    }

    private inspectAnimation(name: string, animation: JsonObject, path: string, pack: string): Finding[] {
        const findings: Finding[] = [];

        for (const [bone, definition] of EmoteAnimationLoader.bones(animation)) {
            for (const channel of EmoteAnimationLoader.CHANNELS) {
                if (NonNumericChannelCheck.isLimited(bone, channel) !== this.coversLimitedChannels) {
                    continue;
                }

                for (const keyframe of EmoteAnimationLoader.keyframes(definition, channel)) {
                    if (!keyframe.hasNonNumericValue) {
                        continue;
                    }

                    findings.push(
                        this.finding(
                            "Bone " + bone + " " + channel + " at " + keyframe.time + " seconds has a component that is not a number",
                            path,
                            pack,
                            { field: "animations." + name + ".bones." + bone + "." + channel }
                        )
                    );
                }
            }
        }

        return findings;
    }
}
