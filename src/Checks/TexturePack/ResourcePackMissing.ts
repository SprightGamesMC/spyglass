import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import Check from "../Check.js";
import TexturePackChecks from "./TexturePackChecks.js";

export default class ResourcePackMissing extends Check {
    readonly definition: CheckDefinition = {
        group: TexturePackChecks.GROUP,
        number: TexturePackChecks.RESOURCE_PACK_MISSING,
        slug: "resource-pack-missing",
        severity: "error",
        description: "No resource pack manifest",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const hasResourcePack = context.model.packs.some((pack) => pack.type === PackItemLoader.RESOURCE_PACK_TYPE);

        if (hasResourcePack) {
            return [];
        }

        return [this.finding("A texture pack needs a resource pack manifest and none was found")];
    }
}
