import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { JsonObject } from "../../Types/LoaderTypes.js";
import EmoteAnimationLoader from "../../Loaders/EmoteAnimationLoader.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import Check from "../Check.js";
import EmoteChecks from "./EmoteChecks.js";
import EmoteLimits from "./EmoteLimits.js";
import EmoteSampler from "./EmoteSampler.js";

export default class ScaledChildOfScaledParent extends Check {
    readonly definition: CheckDefinition = {
        group: EmoteChecks.GROUP,
        number: EmoteChecks.SCALED_CHILD_OF_SCALED_PARENT,
        slug: "scaled-child-of-scaled-parent",
        severity: "error",
        description: "Bone has scale away from 1 while an ancestor bone also has scale away from 1",
    };

    private static isScaled(bone: JsonObject): boolean {
        const samples = EmoteSampler.groups(EmoteAnimationLoader.keyframes(bone, "scale")).flat();

        return samples.some((sample) =>
            sample.value.some((component, axis) => Math.abs(component - EmoteLimits.NEUTRAL_SCALE[axis]) > EmoteSampler.tolerance(sample))
        );
    }

    private static scaledAncestor(bone: string, scaled: ReadonlySet<string>): string | undefined {
        let ancestor = EmoteLimits.BONE_PARENTS.get(bone);

        while (ancestor !== undefined && !scaled.has(ancestor)) {
            ancestor = EmoteLimits.BONE_PARENTS.get(ancestor);
        }

        return ancestor;
    }

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const data of await PersonaLoader.emotes(context)) {
            const file = await EmoteAnimationLoader.load(context, data);

            if (file === undefined) {
                continue;
            }

            for (const [name, animation] of file.animations) {
                const scaled = new Set<string>();

                for (const [bone, definition] of EmoteAnimationLoader.bones(animation)) {
                    if (ScaledChildOfScaledParent.isScaled(definition)) {
                        scaled.add(bone);
                    }
                }

                for (const bone of scaled) {
                    const ancestor = ScaledChildOfScaledParent.scaledAncestor(bone, scaled);

                    if (ancestor === undefined) {
                        continue;
                    }

                    findings.push(
                        this.finding(
                            "Bone " + bone + " has scale while its ancestor bone " + ancestor + " also has scale",
                            file.path,
                            data.pack.root,
                            {
                                field: "animations." + name + ".bones." + bone + ".scale",
                            }
                        )
                    );
                }
            }
        }

        return findings;
    }
}
