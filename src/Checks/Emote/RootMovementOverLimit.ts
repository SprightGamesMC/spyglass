import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { EmoteSample } from "../../Types/PersonaTypes.js";
import EmoteAnimationLoader from "../../Loaders/EmoteAnimationLoader.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import Check from "../Check.js";
import EmoteChecks from "./EmoteChecks.js";
import EmoteLimits from "./EmoteLimits.js";
import EmoteSampler from "./EmoteSampler.js";

export default class RootMovementOverLimit extends Check {
    readonly definition: CheckDefinition = {
        group: EmoteChecks.GROUP,
        number: EmoteChecks.ROOT_MOVEMENT_OVER_LIMIT,
        slug: "root-movement-over-limit",
        severity: "error",
        description: "Root moves above 16 on Y, below 0 on Y, or beyond plus or minus 4 on X or Z",
    };

    private static problem(sample: EmoteSample): string | undefined {
        const [x, y, z] = sample.value;
        const tolerance = EmoteSampler.tolerance(sample);

        if (y < EmoteLimits.ROOT_Y_MIN - tolerance || y > EmoteLimits.ROOT_Y_MAX + tolerance) {
            return "Y " + EmoteSampler.rounded(y) + " is outside " + EmoteLimits.ROOT_Y_MIN + " to " + EmoteLimits.ROOT_Y_MAX;
        }

        if (Math.abs(x) > EmoteLimits.ROOT_HORIZONTAL_LIMIT + tolerance) {
            return "X " + EmoteSampler.rounded(x) + " is beyond plus or minus " + EmoteLimits.ROOT_HORIZONTAL_LIMIT;
        }

        if (Math.abs(z) > EmoteLimits.ROOT_HORIZONTAL_LIMIT + tolerance) {
            return "Z " + EmoteSampler.rounded(z) + " is beyond plus or minus " + EmoteLimits.ROOT_HORIZONTAL_LIMIT;
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

                const keyframes = EmoteAnimationLoader.keyframes(root, "position");

                for (const failure of EmoteSampler.firstFailures(keyframes, RootMovementOverLimit.problem)) {
                    const time = EmoteSampler.rounded(failure.time);

                    findings.push(
                        this.finding("Root position at " + time + " seconds: " + failure.problem, file.path, data.pack.root, {
                            field: "animations." + name + ".bones.root.position." + time,
                        })
                    );
                }
            }
        }

        return findings;
    }
}
