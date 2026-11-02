import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { EmoteSample } from "../../Types/PersonaTypes.js";
import EmoteAnimationLoader from "../../Loaders/EmoteAnimationLoader.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import Check from "../Check.js";
import EmoteChecks from "./EmoteChecks.js";
import EmoteLimits from "./EmoteLimits.js";
import EmoteSampler from "./EmoteSampler.js";

export default class RootLandingOffset extends Check {
    readonly definition: CheckDefinition = {
        group: EmoteChecks.GROUP,
        number: EmoteChecks.ROOT_LANDING_OFFSET,
        slug: "root-landing-offset",
        severity: "error",
        description: "Root reaches Y 0 from above with X or Z away from 0",
    };

    private static isAboveGround(sample: EmoteSample): boolean {
        return sample.value[1] > EmoteLimits.ROOT_Y_MIN + EmoteSampler.tolerance(sample);
    }

    private static isOnGround(sample: EmoteSample): boolean {
        return Math.abs(sample.value[1] - EmoteLimits.ROOT_Y_MIN) <= EmoteSampler.tolerance(sample);
    }

    private static isOffset(sample: EmoteSample): boolean {
        const tolerance = EmoteSampler.tolerance(sample);

        return Math.abs(sample.value[0]) > tolerance || Math.abs(sample.value[2]) > tolerance;
    }

    private static landings(samples: readonly EmoteSample[]): EmoteSample[] {
        return samples.filter(
            (sample, index) =>
                index > 0 &&
                RootLandingOffset.isAboveGround(samples[index - 1]) &&
                RootLandingOffset.isOnGround(sample) &&
                RootLandingOffset.isOffset(sample)
        );
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

                const samples = EmoteSampler.groups(EmoteAnimationLoader.keyframes(root, "position")).flat();

                for (const landing of RootLandingOffset.landings(samples)) {
                    const time = EmoteSampler.rounded(landing.time);
                    const [x, , z] = landing.value;

                    findings.push(
                        this.finding(
                            "Root reaches Y 0 at " +
                                time +
                                " seconds with X " +
                                EmoteSampler.rounded(x) +
                                " and Z " +
                                EmoteSampler.rounded(z),
                            file.path,
                            data.pack.root,
                            { field: "animations." + name + ".bones.root.position." + time }
                        )
                    );
                }
            }
        }

        return findings;
    }
}
