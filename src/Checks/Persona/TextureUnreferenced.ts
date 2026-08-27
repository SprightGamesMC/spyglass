import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import Check from "../Check.js";
import PersonaChecks from "./PersonaChecks.js";

export default class TextureUnreferenced extends Check {
    readonly definition: CheckDefinition = {
        group: PersonaChecks.GROUP,
        number: PersonaChecks.TEXTURE_UNREFERENCED,
        slug: "texture-unreferenced",
        severity: "warning",
        description: "Image file in the pack is not listed in the meta",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const data of await PersonaLoader.pieces(context)) {
            if (data.meta === undefined) {
                continue;
            }

            const referenced = new Set(PersonaLoader.textureReferences(data.meta).map((reference) => reference.name));

            for (const item of data.pack.items) {
                if (item.kind !== "texture" || referenced.has(item.packPath)) {
                    continue;
                }

                findings.push(this.finding("Image " + item.packPath + " is not listed in the meta", item.path, data.pack.root));
            }
        }

        return findings;
    }
}
