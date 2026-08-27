import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import EmoteAnimationLoader from "../../Loaders/EmoteAnimationLoader.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import Check from "../Check.js";
import EmoteChecks from "./EmoteChecks.js";
import EmoteLimits from "./EmoteLimits.js";

export default class BoneNotAllowed extends Check {
    readonly definition: CheckDefinition = {
        group: EmoteChecks.GROUP,
        number: EmoteChecks.BONE_NOT_ALLOWED,
        slug: "bone-not-allowed",
        severity: "error",
        description: "Animation moves a bone that is not in the allowed set",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const data of await PersonaLoader.emotes(context)) {
            const file = await EmoteAnimationLoader.load(context, data);

            if (file === undefined) {
                continue;
            }

            for (const [name, animation] of file.animations) {
                for (const bone of EmoteAnimationLoader.bones(animation).keys()) {
                    if (EmoteLimits.ALLOWED_BONES.includes(bone)) {
                        continue;
                    }

                    findings.push(
                        this.finding("Bone " + bone + " is not one of " + EmoteLimits.ALLOWED_BONES.join(", "), file.path, data.pack.root, {
                            field: "animations." + name + ".bones." + bone,
                        })
                    );
                }
            }
        }

        return findings;
    }
}
