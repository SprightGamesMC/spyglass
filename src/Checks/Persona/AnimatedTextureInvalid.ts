import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import Check from "../Check.js";
import PersonaChecks from "./PersonaChecks.js";
import PersonaLimits from "./PersonaLimits.js";

export default class AnimatedTextureInvalid extends Check {
    readonly definition: CheckDefinition = {
        group: PersonaChecks.GROUP,
        number: PersonaChecks.ANIMATED_TEXTURE_INVALID,
        slug: "animated-texture-invalid",
        severity: "error",
        description: "Flipbook frame is not 32 by 32 or 128 by 128, or frame count is not a power of two",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const data of await PersonaLoader.pieces(context)) {
            const sources = [...PersonaLoader.textureSources(data.meta), ...PersonaLoader.geometrySources(data.meta)];

            for (const image of await PersonaLoader.imageSources(context, data, sources, PersonaLoader.isAnimated)) {
                const { width, height } = image.metadata;
                const field = { field: image.field };

                if (!PersonaLimits.FRAME_SIZES.includes(width)) {
                    findings.push(
                        this.finding(
                            "Animated texture " +
                                image.name +
                                " frame is " +
                                width +
                                " wide, expected " +
                                PersonaLimits.FRAME_SIZES.join(" or "),
                            image.item.path,
                            data.pack.root,
                            field
                        )
                    );
                    continue;
                }

                const frames = height / width;

                if (PersonaLoader.isPowerOfTwo(frames)) {
                    continue;
                }

                findings.push(
                    this.finding(
                        "Animated texture " +
                            image.name +
                            " is " +
                            width +
                            " by " +
                            height +
                            ", frame count " +
                            frames +
                            " is not a power of two",
                        image.item.path,
                        data.pack.root,
                        field
                    )
                );
            }
        }

        return findings;
    }
}
