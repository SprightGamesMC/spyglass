import type { CheckDefinition } from "../../Types/CheckTypes.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import AddonChecks from "./AddonChecks.js";
import AddonPackMissingCheck from "./AddonPackMissingCheck.js";

export default class BehaviorPackMissing extends AddonPackMissingCheck {
    readonly definition: CheckDefinition = {
        group: AddonChecks.GROUP,
        number: AddonChecks.BEHAVIOR_PACK_MISSING,
        slug: "behavior-pack-missing",
        severity: "error",
        description: "No valid behavior pack manifest",
    };
    protected readonly packType = PackItemLoader.BEHAVIOR_PACK_TYPE;
}
