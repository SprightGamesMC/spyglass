import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { JsonObject } from "../../Types/LoaderTypes.js";
import type { Pack } from "../../Types/ModelTypes.js";
import ManifestLoader from "../../Loaders/ManifestLoader.js";
import VersionUtilities from "../../Loaders/VersionUtilities.js";
import ManifestCheck from "./ManifestCheck.js";
import ManifestChecks from "./ManifestChecks.js";
import ManifestLimits from "./ManifestLimits.js";

export default class MinEngineVersionBelowCurrent extends ManifestCheck {
    readonly definition: CheckDefinition = {
        group: ManifestChecks.GROUP,
        number: ManifestChecks.MIN_ENGINE_VERSION_BELOW_CURRENT,
        slug: "min-engine-version-below-current",
        severity: "recommendation",
        description: "min_engine_version below the previous release",
    };

    protected async checkManifest(context: CheckContext, pack: Pack, manifest: JsonObject): Promise<Finding[]> {
        if (!ManifestLimits.MIN_ENGINE_VERSION_PACK_TYPES.includes(pack.type)) {
            return [];
        }

        const minEngineVersion = ManifestLoader.minEngineVersion(manifest);
        const current = context.loaders.currentGameVersion;

        if (minEngineVersion === undefined || !VersionUtilities.isMajorMinorBelow(minEngineVersion, current)) {
            return [];
        }

        const previous = current.major + "." + VersionUtilities.previousMinor(current);
        const message = "min_engine_version " + VersionUtilities.format(minEngineVersion) + " is below the previous release " + previous;

        return [this.manifestFinding(pack, message, "header.min_engine_version")];
    }
}
