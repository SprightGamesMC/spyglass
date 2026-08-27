import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import PathUtilities from "../../Storage/PathUtilities.js";
import Check from "../Check.js";
import PersonaChecks from "./PersonaChecks.js";
import PersonaLimits from "./PersonaLimits.js";

export default class TextureFormatInvalid extends Check {
    readonly definition: CheckDefinition = {
        group: PersonaChecks.GROUP,
        number: PersonaChecks.TEXTURE_FORMAT_INVALID,
        slug: "texture-format-invalid",
        severity: "error",
        description: "Texture or tint map is not PNG or TGA",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const data of await PersonaLoader.pieces(context)) {
            if (data.metaPath === undefined) {
                continue;
            }

            for (const reference of PersonaLoader.textureReferences(data.meta)) {
                const extension = PathUtilities.extension(reference.name);

                if (PersonaLimits.TEXTURE_EXTENSIONS.includes(extension)) {
                    continue;
                }

                findings.push(
                    this.finding(reference.name + " is not a PNG or TGA file", data.metaPath, data.pack.root, { field: reference.field })
                );
            }
        }

        return findings;
    }
}
