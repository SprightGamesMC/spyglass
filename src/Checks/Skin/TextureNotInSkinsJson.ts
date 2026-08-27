import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import SkinPackLoader from "../../Loaders/SkinPackLoader.js";
import PathUtilities from "../../Storage/PathUtilities.js";
import Check from "../Check.js";
import SkinChecks from "./SkinChecks.js";
import SkinLimits from "./SkinLimits.js";

export default class TextureNotInSkinsJson extends Check {
    readonly definition: CheckDefinition = {
        group: SkinChecks.GROUP,
        number: SkinChecks.TEXTURE_NOT_IN_SKINS_JSON,
        slug: "texture-not-in-skins-json",
        severity: "error",
        description: "Texture file not referenced by skins.json",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const definition of await SkinPackLoader.load(context)) {
            const known = new Set<string>();

            for (const skin of definition.skins) {
                for (const name of [skin.texture, skin.cape]) {
                    if (name !== undefined) {
                        known.add(PathUtilities.fileName(name));
                    }
                }
            }

            for (const item of SkinPackLoader.textureItems(definition.pack)) {
                const name = PathUtilities.fileName(item.packPath);

                if (known.has(name) || name.startsWith(SkinLimits.PACK_ICON_PREFIX)) {
                    continue;
                }

                findings.push(this.finding("Texture " + name + " is not referenced by skins.json", item.path, definition.pack.root));
            }
        }

        return findings;
    }
}
