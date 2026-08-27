import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { JsonObject } from "../../Types/LoaderTypes.js";
import type { Pack } from "../../Types/ModelTypes.js";
import ManifestLoader from "../../Loaders/ManifestLoader.js";
import VersionUtilities from "../../Loaders/VersionUtilities.js";
import ManifestCheck from "./ManifestCheck.js";
import ManifestChecks from "./ManifestChecks.js";
import ManifestLimits from "./ManifestLimits.js";

export default class PbrMinEngineVersionTooLow extends ManifestCheck {
    readonly definition: CheckDefinition = {
        group: ManifestChecks.GROUP,
        number: ManifestChecks.PBR_MIN_ENGINE_VERSION_TOO_LOW,
        slug: "pbr-min-engine-version-too-low",
        severity: "error",
        description:
            ManifestLimits.PBR_CAPABILITY +
            " capability with min_engine_version below " +
            VersionUtilities.format(ManifestLimits.PBR_MIN_ENGINE_VERSION),
    };

    protected async checkManifest(_context: CheckContext, pack: Pack, manifest: JsonObject): Promise<Finding[]> {
        const hasPbr = ManifestLoader.hasCapability(manifest, ManifestLimits.PBR_CAPABILITY);
        const minEngineVersion = ManifestLoader.minEngineVersion(manifest);

        if (!hasPbr || minEngineVersion === undefined) {
            return [];
        }

        if (VersionUtilities.compare(minEngineVersion, ManifestLimits.PBR_MIN_ENGINE_VERSION) >= 0) {
            return [];
        }

        const message =
            "pbr capability needs min_engine_version " +
            VersionUtilities.format(ManifestLimits.PBR_MIN_ENGINE_VERSION) +
            " or higher, found " +
            VersionUtilities.format(minEngineVersion);

        return [this.manifestFinding(pack, message, "header.min_engine_version")];
    }
}
