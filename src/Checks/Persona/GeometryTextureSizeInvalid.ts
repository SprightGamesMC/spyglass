import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import Check from "../Check.js";
import PersonaChecks from "./PersonaChecks.js";

export default class GeometryTextureSizeInvalid extends Check {
    readonly definition: CheckDefinition = {
        group: PersonaChecks.GROUP,
        number: PersonaChecks.GEOMETRY_TEXTURE_SIZE_INVALID,
        slug: "geometry-texture-size-invalid",
        severity: "error",
        description: "Geometry texture is not square or not a power of two",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const data of await PersonaLoader.pieces(context)) {
            const sources = PersonaLoader.geometrySources(data.meta);

            for (const image of await PersonaLoader.imageSources(context, data, sources, (entry) => !PersonaLoader.isAnimated(entry))) {
                const { width, height } = image.metadata;

                if (width === height && PersonaLoader.isPowerOfTwo(width)) {
                    continue;
                }

                findings.push(
                    this.finding(
                        "Geometry texture " + image.name + " is " + width + " by " + height + ", expected a square power of two",
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
