import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { JsonObject } from "../../Types/LoaderTypes.js";
import type { Pack } from "../../Types/ModelTypes.js";
import ManifestLoader from "../../Loaders/ManifestLoader.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import ManifestCheck from "./ManifestCheck.js";
import ManifestChecks from "./ManifestChecks.js";

export default class CapabilitiesOnBehaviorPack extends ManifestCheck {
    readonly definition: CheckDefinition = {
        group: ManifestChecks.GROUP,
        number: ManifestChecks.CAPABILITIES_ON_BEHAVIOR_PACK,
        slug: "capabilities-on-behavior-pack",
        severity: "warning",
        description: "Behavior pack declares capabilities",
    };

    protected async checkManifest(_context: CheckContext, pack: Pack, manifest: JsonObject): Promise<Finding[]> {
        const capabilities = ManifestLoader.capabilities(manifest);

        if (pack.type !== PackItemLoader.BEHAVIOR_PACK_TYPE || capabilities.length === 0) {
            return [];
        }

        const message = "Behavior pack declares capabilities " + JSON.stringify(capabilities) + ", not allowed on Marketplace";

        return [this.manifestFinding(pack, message, "capabilities")];
    }
}
