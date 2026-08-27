import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import EmoteAnimationLoader from "../../Loaders/EmoteAnimationLoader.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import Check from "../Check.js";
import EmoteChecks from "./EmoteChecks.js";
import EmoteLimits from "./EmoteLimits.js";

export default class AnimationNameMismatch extends Check {
    readonly definition: CheckDefinition = {
        group: EmoteChecks.GROUP,
        number: EmoteChecks.ANIMATION_NAME_MISMATCH,
        slug: "animation-name-mismatch",
        severity: "error",
        description: "animation_sources name is not animation.<id> or is not a key in the animation file",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const data of await PersonaLoader.emotes(context)) {
            const pieceName = PersonaLoader.string(data.meta, "piece_name");
            const source = PersonaLoader.animationSource(data.meta);
            const name = source === undefined ? undefined : PersonaLoader.string(source.entry, "name");

            if (pieceName === undefined || source === undefined || name === undefined || data.metaPath === undefined) {
                continue;
            }

            const location = { field: source.field + ".name" };
            const expected = EmoteLimits.ANIMATION_NAME_PREFIX + pieceName;

            if (name !== expected) {
                findings.push(
                    this.finding("animation_sources name " + name + " is not " + expected, data.metaPath, data.pack.root, location)
                );
                continue;
            }

            const animation = await EmoteAnimationLoader.load(context, data);

            if (animation === undefined || animation.animations.has(name)) {
                continue;
            }

            findings.push(
                this.finding(
                    "animation_sources name " + name + " is not a key under animations in " + animation.path,
                    data.metaPath,
                    data.pack.root,
                    location
                )
            );
        }

        return findings;
    }
}
