import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { JsonObject } from "../../Types/LoaderTypes.js";
import type { Pack } from "../../Types/ModelTypes.js";
import JsonLoader from "../../Loaders/JsonLoader.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import ManifestCheck from "./ManifestCheck.js";
import ManifestChecks from "./ManifestChecks.js";

export default class SubpacksNotApplicable extends ManifestCheck {
    readonly definition: CheckDefinition = {
        group: ManifestChecks.GROUP,
        number: ManifestChecks.SUBPACKS_NOT_APPLICABLE,
        slug: "subpacks-not-applicable",
        severity: "error",
        description: "subpacks on a pack that is not a resource pack",
    };

    protected async checkManifest(_context: CheckContext, pack: Pack, manifest: JsonObject): Promise<Finding[]> {
        if (pack.type === PackItemLoader.RESOURCE_PACK_TYPE || JsonLoader.get(manifest, "subpacks") === undefined) {
            return [];
        }

        const message = "subpacks are only for resource packs, this pack is a " + pack.type + " pack";

        return [this.manifestFinding(pack, message, "subpacks")];
    }
}
