import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { JsonObject } from "../../Types/LoaderTypes.js";
import type { Pack } from "../../Types/ModelTypes.js";
import JsonLoader from "../../Loaders/JsonLoader.js";
import ManifestCheck from "./ManifestCheck.js";
import ManifestChecks from "./ManifestChecks.js";
import ManifestLimits from "./ManifestLimits.js";

export default class PackScopeInvalid extends ManifestCheck {
    readonly definition: CheckDefinition = {
        group: ManifestChecks.GROUP,
        number: ManifestChecks.PACK_SCOPE_INVALID,
        slug: "pack-scope-invalid",
        severity: "error",
        description: "pack_scope is not global, world, or any",
    };

    protected async checkManifest(_context: CheckContext, pack: Pack, manifest: JsonObject): Promise<Finding[]> {
        const scope = JsonLoader.get(manifest, "header", "pack_scope");

        if (typeof scope !== "string" || ManifestLimits.PACK_SCOPES.includes(scope)) {
            return [];
        }

        const message = "header.pack_scope " + scope + " is not one of " + ManifestLimits.PACK_SCOPES.join(", ");

        return [this.manifestFinding(pack, message, "header.pack_scope")];
    }
}
