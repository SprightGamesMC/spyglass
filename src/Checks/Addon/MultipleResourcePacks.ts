import type { CheckDefinition } from "../../Types/CheckTypes.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import AddonChecks from "./AddonChecks.js";
import AddonMultiplePacksCheck from "./AddonMultiplePacksCheck.js";

export default class MultipleResourcePacks extends AddonMultiplePacksCheck {
    readonly definition: CheckDefinition = {
        group: AddonChecks.GROUP,
        number: AddonChecks.MULTIPLE_RESOURCE_PACKS,
        slug: "multiple-resource-packs",
        severity: "error",
        description: "More than one resource pack manifest",
    };
    protected readonly packType = PackItemLoader.RESOURCE_PACK_TYPE;
}
