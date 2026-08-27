import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import Check from "../Check.js";
import EmoteChecks from "./EmoteChecks.js";
import EmoteLimits from "./EmoteLimits.js";

export default class AnimationSourceMissing extends Check {
    readonly definition: CheckDefinition = {
        group: EmoteChecks.GROUP,
        number: EmoteChecks.ANIMATION_SOURCE_MISSING,
        slug: "animation-source-missing",
        severity: "error",
        description: "Meta has no animation_sources entry",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const data of await PersonaLoader.emotes(context)) {
            if (
                data.meta === undefined ||
                data.metaPath === undefined ||
                PersonaLoader.hasSources(data.meta, EmoteLimits.ANIMATION_SOURCES_KEY)
            ) {
                continue;
            }

            findings.push(
                this.finding("Meta has no animation_sources entry", data.metaPath, data.pack.root, {
                    field: EmoteLimits.ANIMATION_SOURCES_KEY,
                })
            );
        }

        return findings;
    }
}
