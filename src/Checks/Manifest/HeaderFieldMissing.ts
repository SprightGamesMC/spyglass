import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { JsonObject } from "../../Types/LoaderTypes.js";
import type { Pack } from "../../Types/ModelTypes.js";
import JsonLoader from "../../Loaders/JsonLoader.js";
import ManifestLoader from "../../Loaders/ManifestLoader.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import ManifestCheck from "./ManifestCheck.js";
import ManifestChecks from "./ManifestChecks.js";
import ManifestLimits from "./ManifestLimits.js";

export default class HeaderFieldMissing extends ManifestCheck {
    readonly definition: CheckDefinition = {
        group: ManifestChecks.GROUP,
        number: ManifestChecks.HEADER_FIELD_MISSING,
        slug: "header-field-missing",
        severity: "error",
        description: "Required header field absent",
    };

    protected async checkManifest(_context: CheckContext, pack: Pack, manifest: JsonObject): Promise<Finding[]> {
        const findings: Finding[] = [];
        const header = ManifestLoader.header(manifest);
        const description = JsonLoader.get(header, "description");
        const descriptionMissing = typeof description !== "string" || description === "";

        if (pack.type !== PackItemLoader.SKIN_PACK_TYPE && descriptionMissing) {
            findings.push(this.manifestFinding(pack, "header.description is missing", "header.description"));
        }

        if (this.requiresMinEngineVersion(pack, manifest) && JsonLoader.get(header, "min_engine_version") === undefined) {
            findings.push(this.manifestFinding(pack, "header.min_engine_version is missing", "header.min_engine_version"));
        }

        return findings;
    }

    private requiresMinEngineVersion(pack: Pack, manifest: JsonObject): boolean {
        if (pack.type === PackItemLoader.BEHAVIOR_PACK_TYPE) {
            return true;
        }

        if (pack.type !== PackItemLoader.RESOURCE_PACK_TYPE) {
            return false;
        }

        const formatVersion = ManifestLoader.formatVersion(manifest);

        return formatVersion !== undefined && formatVersion >= ManifestLimits.FORMAT_VERSION_2;
    }
}
