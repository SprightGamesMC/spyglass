import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { SkinPackDefinition, SkinTextureRole } from "../../Types/SkinTypes.js";
import SkinPackLoader from "../../Loaders/SkinPackLoader.js";
import Check from "../Check.js";
import SkinChecks from "./SkinChecks.js";

export default class TextureDuplicate extends Check {
    readonly definition: CheckDefinition = {
        group: SkinChecks.GROUP,
        number: SkinChecks.TEXTURE_DUPLICATE,
        slug: "texture-duplicate",
        severity: "warning",
        description: "Two skins share a texture file",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const definition of await SkinPackLoader.load(context)) {
            findings.push(...this.checkRole(definition, "skin"));
            findings.push(...this.checkRole(definition, "cape"));
        }

        return findings;
    }

    private checkRole(definition: SkinPackDefinition, role: SkinTextureRole): Finding[] {
        const findings: Finding[] = [];
        const seen = new Map<string, number>();
        const property = role === "skin" ? "texture" : "cape";

        for (const skin of definition.skins) {
            const name = role === "skin" ? skin.texture : skin.cape;

            if (name === undefined) {
                continue;
            }

            const firstIndex = seen.get(name);

            if (firstIndex === undefined) {
                seen.set(name, skin.index);
                continue;
            }

            findings.push(
                this.finding(
                    (role === "skin" ? "Skin" : "Cape") + " texture " + name + " is already used by skins[" + firstIndex + "]",
                    definition.path,
                    definition.pack.root,
                    { field: skin.field + "." + property }
                )
            );
        }

        return findings;
    }
}
