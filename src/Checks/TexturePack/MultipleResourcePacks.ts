import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import Check from "../Check.js";
import TexturePackChecks from "./TexturePackChecks.js";
import TexturePackLimits from "./TexturePackLimits.js";

export default class MultipleResourcePacks extends Check {
    readonly definition: CheckDefinition = {
        group: TexturePackChecks.GROUP,
        number: TexturePackChecks.MULTIPLE_RESOURCE_PACKS,
        slug: "multiple-resource-packs",
        severity: "error",
        description: "More than one resource pack manifest",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const resourcePacks = context.model.packs.filter((pack) => pack.type === PackItemLoader.RESOURCE_PACK_TYPE);

        if (resourcePacks.length <= TexturePackLimits.RESOURCE_PACK_LIMIT) {
            return [];
        }

        return resourcePacks
            .slice(TexturePackLimits.RESOURCE_PACK_LIMIT)
            .map((pack) =>
                this.finding(
                    "Found " +
                        resourcePacks.length +
                        " resource pack manifests, a texture pack has exactly " +
                        TexturePackLimits.RESOURCE_PACK_LIMIT,
                    pack.manifestPath,
                    pack.root
                )
            );
    }
}
