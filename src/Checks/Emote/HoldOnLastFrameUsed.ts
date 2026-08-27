import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import EmoteAnimationLoader from "../../Loaders/EmoteAnimationLoader.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import Check from "../Check.js";
import EmoteChecks from "./EmoteChecks.js";
import EmoteLimits from "./EmoteLimits.js";

export default class HoldOnLastFrameUsed extends Check {
    readonly definition: CheckDefinition = {
        group: EmoteChecks.GROUP,
        number: EmoteChecks.HOLD_ON_LAST_FRAME_USED,
        slug: "hold-on-last-frame-used",
        severity: "error",
        description: "Animation loop is hold_on_last_frame",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const data of await PersonaLoader.emotes(context)) {
            const file = await EmoteAnimationLoader.load(context, data);

            if (file === undefined) {
                continue;
            }

            for (const [name, animation] of file.animations) {
                if (animation.loop !== EmoteLimits.LOOP_HOLD_VALUE) {
                    continue;
                }

                findings.push(
                    this.finding("Animation " + name + " has loop " + EmoteLimits.LOOP_HOLD_VALUE, file.path, data.pack.root, {
                        field: "animations." + name + ".loop",
                    })
                );
            }
        }

        return findings;
    }
}
