import type { CheckContext, Finding } from "../../Types/CheckTypes.js";
import type { PackType } from "../../Types/ModelTypes.js";
import Check from "../Check.js";
import AddonManifests from "./AddonManifests.js";

export default abstract class AddonPackMissingCheck extends Check {
    protected abstract readonly packType: PackType;

    async run(context: CheckContext): Promise<Finding[]> {
        const manifests = await AddonManifests.valid(context, this.packType);

        if (manifests.length > 0) {
            return [];
        }

        return [this.finding("No " + this.packType + " pack with a manifest that parses was found, expected exactly one")];
    }
}
