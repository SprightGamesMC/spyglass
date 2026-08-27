import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import EmoteAnimationLoader from "../../Loaders/EmoteAnimationLoader.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import Check from "../Check.js";
import EmoteChecks from "./EmoteChecks.js";

export default class LoopEnabled extends Check {
    readonly definition: CheckDefinition = {
        group: EmoteChecks.GROUP,
        number: EmoteChecks.LOOP_ENABLED,
        slug: "loop-enabled",
        severity: "warning",
        description: "Animation has a loop key set to true",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const data of await PersonaLoader.emotes(context)) {
            const file = await EmoteAnimationLoader.load(context, data);

            if (file === undefined) {
                continue;
            }

            for (const [name, animation] of file.animations) {
                if (animation.loop !== true) {
                    continue;
                }

                findings.push(
                    this.finding("Animation " + name + " has loop true", file.path, data.pack.root, {
                        field: "animations." + name + ".loop",
                    })
                );
            }
        }

        return findings;
    }
}
