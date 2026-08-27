import type { CheckContext, Finding } from "../../Types/CheckTypes.js";
import type { JsonObject } from "../../Types/LoaderTypes.js";
import type { EmoteChannel, EmoteEdge, EmoteKeyframe } from "../../Types/PersonaTypes.js";
import EmoteAnimationLoader from "../../Loaders/EmoteAnimationLoader.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import Check from "../Check.js";
import EmoteLimits from "./EmoteLimits.js";

export default abstract class PoseNotNeutralCheck extends Check {
    protected abstract readonly edge: EmoteEdge;

    private static neutral(bone: string, channel: EmoteChannel): readonly number[] | undefined {
        switch (channel) {
            case "rotation":
                return EmoteLimits.NEUTRAL_ROTATION;
            case "position":
                return bone === EmoteLimits.ROOT_BONE ? EmoteLimits.NEUTRAL_POSITION : undefined;
            case "scale":
                return EmoteLimits.NEUTRAL_SCALE;
        }
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
                const neutral = PoseNotNeutralCheck.neutral(bone, channel);
                const keyframes = EmoteAnimationLoader.keyframes(definition, channel);
                const value = this.edgeValue(keyframes);

                if (neutral === undefined || value === undefined || EmoteAnimationLoader.equals(value, neutral)) {
                    continue;
                }

                findings.push(
                    this.finding(
                        "Bone " +
                            bone +
                            " " +
                            channel +
                            " at the " +
                            this.edge +
                            " is " +
                            EmoteAnimationLoader.formatVector(value) +
                            ", expected " +
                            EmoteAnimationLoader.formatVector(neutral),
                        path,
                        pack,
                        { field: "animations." + name + ".bones." + bone + "." + channel }
                    )
                );
            }
        }

        return findings;
    }

    private edgeValue(keyframes: readonly EmoteKeyframe[]): readonly number[] | undefined {
        return this.edge === "start" ? EmoteAnimationLoader.startValue(keyframes) : EmoteAnimationLoader.endValue(keyframes);
    }
}
