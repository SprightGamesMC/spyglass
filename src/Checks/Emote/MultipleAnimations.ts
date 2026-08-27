import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import EmoteAnimationLoader from "../../Loaders/EmoteAnimationLoader.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import Check from "../Check.js";
import EmoteChecks from "./EmoteChecks.js";

export default class MultipleAnimations extends Check {
    readonly definition: CheckDefinition = {
        group: EmoteChecks.GROUP,
        number: EmoteChecks.MULTIPLE_ANIMATIONS,
        slug: "multiple-animations",
        severity: "error",
        description: "Animation file defines more than one animation",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const data of await PersonaLoader.emotes(context)) {
            const file = await EmoteAnimationLoader.load(context, data);

            if (file === undefined || file.animations.size < 2) {
                continue;
            }

            findings.push(
                this.finding(
                    "Animation file defines " + file.animations.size + " animations, expected 1: " + [...file.animations.keys()].join(", "),
                    file.path,
                    data.pack.root,
                    { field: "animations" }
                )
            );
        }

        return findings;
    }
}
