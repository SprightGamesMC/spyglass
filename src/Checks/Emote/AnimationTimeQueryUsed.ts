import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import EmoteAnimationLoader from "../../Loaders/EmoteAnimationLoader.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import Check from "../Check.js";
import EmoteChecks from "./EmoteChecks.js";
import EmoteLimits from "./EmoteLimits.js";

export default class AnimationTimeQueryUsed extends Check {
    readonly definition: CheckDefinition = {
        group: EmoteChecks.GROUP,
        number: EmoteChecks.ANIMATION_TIME_QUERY_USED,
        slug: "animation-time-query-used",
        severity: "error",
        description: "Animation uses query.anim_time or q.anim_time",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const data of await PersonaLoader.emotes(context)) {
            const path = EmoteAnimationLoader.animationPath(data);

            if (path === undefined) {
                continue;
            }

            const result = await context.loaders.json.read(path);
            const text = result.text ?? "";
            const query = EmoteLimits.ANIMATION_TIME_QUERIES.find((candidate) => text.includes(candidate));

            if (query === undefined) {
                continue;
            }

            findings.push(this.finding("Animation file uses " + query, path, data.pack.root));
        }

        return findings;
    }
}
