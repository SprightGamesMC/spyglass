import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import PathUtilities from "../../Storage/PathUtilities.js";
import Check from "../Check.js";
import PersonaChecks from "./PersonaChecks.js";

export default class TextureNameNotLowercase extends Check {
    readonly definition: CheckDefinition = {
        group: PersonaChecks.GROUP,
        number: PersonaChecks.TEXTURE_NAME_NOT_LOWERCASE,
        slug: "texture-name-not-lowercase",
        severity: "error",
        description: "Texture file name has upper case letters",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const data of await PersonaLoader.pieces(context)) {
            for (const item of data.pack.items) {
                if (item.kind !== "texture") {
                    continue;
                }

                const name = PathUtilities.fileName(item.path);

                if (name === name.toLowerCase()) {
                    continue;
                }

                findings.push(this.finding("Texture file name " + name + " has upper case letters", item.path, data.pack.root));
            }
        }

        return findings;
    }
}
