import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import SkinPackLoader from "../../Loaders/SkinPackLoader.js";
import PathUtilities from "../../Storage/PathUtilities.js";
import Check from "../Check.js";
import SkinChecks from "./SkinChecks.js";
import SkinLimits from "./SkinLimits.js";

export default class TextureNameNoModelTarget extends Check {
    readonly definition: CheckDefinition = {
        group: SkinChecks.GROUP,
        number: SkinChecks.TEXTURE_NAME_NO_MODEL_TARGET,
        slug: "texture-name-no-model-target",
        severity: "error",
        description: "Texture name has no model marker",
    };

    private static hasModelMarker(texture: string): boolean {
        const tokens = PathUtilities.nameWithoutExtension(texture).split("_");
        const first = tokens[0].toLowerCase();
        const last = tokens[tokens.length - 1].toLowerCase();

        return SkinLimits.MODEL_MARKERS.includes(first) || SkinLimits.MODEL_MARKERS.includes(last);
    }

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const definition of await SkinPackLoader.load(context)) {
            for (const skin of definition.skins) {
                if (skin.texture === undefined || TextureNameNoModelTarget.hasModelMarker(skin.texture)) {
                    continue;
                }

                findings.push(
                    this.finding(
                        "Texture name " +
                            skin.texture +
                            " has no model marker at the start or end, expected one of " +
                            SkinLimits.MODEL_MARKERS.join(", "),
                        definition.path,
                        definition.pack.root,
                        { field: skin.field + ".texture" }
                    )
                );
            }
        }

        return findings;
    }
}
