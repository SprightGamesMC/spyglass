import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import Check from "../Check.js";
import PersonaChecks from "./PersonaChecks.js";
import PersonaLimits from "./PersonaLimits.js";

export default class TextureFramesOverLimit extends Check {
    readonly definition: CheckDefinition = {
        group: PersonaChecks.GROUP,
        number: PersonaChecks.TEXTURE_FRAMES_OVER_LIMIT,
        slug: "texture-frames-over-limit",
        severity: "error",
        description: "More than 32 frames at 32 px or more than 16 frames at 128 px",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const data of await PersonaLoader.pieces(context)) {
            const sources = [...PersonaLoader.textureSources(data.meta), ...PersonaLoader.geometrySources(data.meta)];

            for (const image of await PersonaLoader.imageSources(context, data, sources, PersonaLoader.isAnimated)) {
                const { width, height } = image.metadata;
                const limit = PersonaLimits.FRAME_LIMITS[width];

                if (limit === undefined) {
                    continue;
                }

                const frames = height / width;

                if (frames <= limit) {
                    continue;
                }

                findings.push(
                    this.finding(
                        "Animated texture " + image.name + " has " + frames + " frames at " + width + " px, limit is " + limit,
                        image.item.path,
                        data.pack.root,
                        { field: image.field }
                    )
                );
            }
        }

        return findings;
    }
}
