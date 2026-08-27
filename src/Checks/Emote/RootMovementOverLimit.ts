import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { EmoteKeyframe } from "../../Types/PersonaTypes.js";
import EmoteAnimationLoader from "../../Loaders/EmoteAnimationLoader.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import Check from "../Check.js";
import EmoteChecks from "./EmoteChecks.js";
import EmoteLimits from "./EmoteLimits.js";

export default class RootMovementOverLimit extends Check {
    readonly definition: CheckDefinition = {
        group: EmoteChecks.GROUP,
        number: EmoteChecks.ROOT_MOVEMENT_OVER_LIMIT,
        slug: "root-movement-over-limit",
        severity: "error",
        description: "Root moves above 16 on Y, below 0 on Y, or beyond plus or minus 4 on X or Z",
    };

    private static problem(keyframe: EmoteKeyframe): string | undefined {
        for (const position of [keyframe.pre, keyframe.post]) {
            const problem = position === undefined ? undefined : RootMovementOverLimit.describe(position);

            if (problem !== undefined) {
                return problem;
            }
        }

        return undefined;
    }

    private static describe(position: readonly number[]): string | undefined {
        const [x, y, z] = position;

        if (y < EmoteLimits.ROOT_Y_MIN || y > EmoteLimits.ROOT_Y_MAX) {
            return "Y " + y + " is outside " + EmoteLimits.ROOT_Y_MIN + " to " + EmoteLimits.ROOT_Y_MAX;
        }

        if (Math.abs(x) > EmoteLimits.ROOT_HORIZONTAL_LIMIT) {
            return "X " + x + " is beyond plus or minus " + EmoteLimits.ROOT_HORIZONTAL_LIMIT;
        }

        if (Math.abs(z) > EmoteLimits.ROOT_HORIZONTAL_LIMIT) {
            return "Z " + z + " is beyond plus or minus " + EmoteLimits.ROOT_HORIZONTAL_LIMIT;
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
                const root = EmoteAnimationLoader.bones(animation).get(EmoteLimits.ROOT_BONE);

                if (root === undefined) {
                    continue;
                }

                for (const keyframe of EmoteAnimationLoader.keyframes(root, "position")) {
                    const problem = RootMovementOverLimit.problem(keyframe);

                    if (problem === undefined) {
                        continue;
                    }

                    findings.push(
                        this.finding("Root position at " + keyframe.time + " seconds: " + problem, file.path, data.pack.root, {
                            field: "animations." + name + ".bones.root.position." + keyframe.time,
                        })
                    );
                }
            }
        }

        return findings;
    }
}
