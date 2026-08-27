import type { CheckDefinition } from "../../Types/CheckTypes.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import AddonChecks from "./AddonChecks.js";
import AddonPackMissingCheck from "./AddonPackMissingCheck.js";

export default class ResourcePackMissing extends AddonPackMissingCheck {
    readonly definition: CheckDefinition = {
        group: AddonChecks.GROUP,
        number: AddonChecks.RESOURCE_PACK_MISSING,
        slug: "resource-pack-missing",
        severity: "error",
        description: "No valid resource pack manifest",
    };
    protected readonly packType = PackItemLoader.RESOURCE_PACK_TYPE;
}
