import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import Check from "../Check.js";
import PersonaChecks from "./PersonaChecks.js";

export default class TextureNotFound extends Check {
    readonly definition: CheckDefinition = {
        group: PersonaChecks.GROUP,
        number: PersonaChecks.TEXTURE_NOT_FOUND,
        slug: "texture-not-found",
        severity: "error",
        description: "Meta texture or tint map refers to a file not in the pack",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const data of await PersonaLoader.pieces(context)) {
            if (data.metaPath === undefined) {
                continue;
            }

            for (const reference of PersonaLoader.textureReferences(data.meta)) {
                if (PersonaLoader.findItem(data.pack, reference.name) !== undefined) {
                    continue;
                }

                findings.push(
                    this.finding("Meta names " + reference.name + " which is not in the pack", data.metaPath, data.pack.root, {
                        field: reference.field,
                    })
                );
            }
        }

        return findings;
    }
}
