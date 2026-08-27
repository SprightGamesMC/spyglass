import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import Check from "../Check.js";
import TexturePackChecks from "./TexturePackChecks.js";

export default class BehaviorPackNotAllowed extends Check {
    readonly definition: CheckDefinition = {
        group: TexturePackChecks.GROUP,
        number: TexturePackChecks.BEHAVIOR_PACK_NOT_ALLOWED,
        slug: "behavior-pack-not-allowed",
        severity: "error",
        description: "Behavior pack present",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        return context.model.packs
            .filter((pack) => pack.type === PackItemLoader.BEHAVIOR_PACK_TYPE)
            .map((pack) =>
                this.finding("A texture pack is a resource pack alone, but a behavior pack is present", pack.manifestPath, pack.root)
            );
    }
}
