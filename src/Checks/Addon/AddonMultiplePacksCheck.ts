import type { CheckContext, Finding } from "../../Types/CheckTypes.js";
import type { PackType } from "../../Types/ModelTypes.js";
import Check from "../Check.js";

export default abstract class AddonMultiplePacksCheck extends Check {
    protected abstract readonly packType: PackType;

    async run(context: CheckContext): Promise<Finding[]> {
        const packs = context.model.packs.filter((pack) => pack.type === this.packType);

        if (packs.length <= 1) {
            return [];
        }

        return packs.map((pack) =>
            this.finding("Found " + packs.length + " " + this.packType + " packs, expected exactly one", pack.manifestPath, pack.root)
        );
    }
}
