import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import TextureMemoryLoader from "../../Loaders/TextureMemoryLoader.js";
import Check from "../Check.js";
import TextureChecks from "./TextureChecks.js";
import TextureLimits from "./TextureLimits.js";

export default class TextureSetLayerNotFound extends Check {
    readonly definition: CheckDefinition = {
        group: TextureChecks.GROUP,
        number: TextureChecks.TEXTURE_SET_LAYER_NOT_FOUND,
        slug: "texture-set-layer-not-found",
        severity: "error",
        description: "texture_set.json refers to a layer file that does not exist",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const memory of await TextureMemoryLoader.load(context)) {
            for (const layer of memory.layers) {
                if (layer.resolved) {
                    continue;
                }

                findings.push(
                    this.finding(
                        "Layer " + layer.layer + " names " + layer.reference + " but no image with that name exists",
                        layer.path,
                        memory.pack.root,
                        { field: TextureLimits.TEXTURE_SET_ROOT + "." + layer.layer }
                    )
                );
            }
        }

        return findings;
    }
}
