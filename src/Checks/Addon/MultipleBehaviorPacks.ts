import type { CheckDefinition } from "../../Types/CheckTypes.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import AddonChecks from "./AddonChecks.js";
import AddonMultiplePacksCheck from "./AddonMultiplePacksCheck.js";

export default class MultipleBehaviorPacks extends AddonMultiplePacksCheck {
    readonly definition: CheckDefinition = {
        group: AddonChecks.GROUP,
        number: AddonChecks.MULTIPLE_BEHAVIOR_PACKS,
        slug: "multiple-behavior-packs",
        severity: "error",
        description: "More than one behavior pack manifest",
    };
    protected readonly packType = PackItemLoader.BEHAVIOR_PACK_TYPE;
}
