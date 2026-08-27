import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import JsonLoader from "../../Loaders/JsonLoader.js";
import ManifestLoader from "../../Loaders/ManifestLoader.js";
import Check from "../Check.js";
import WorldChecks from "./WorldChecks.js";
import WorldLimits from "./WorldLimits.js";

export default class LockTemplateOptionsMissing extends Check {
    readonly definition: CheckDefinition = {
        group: WorldChecks.GROUP,
        number: WorldChecks.LOCK_TEMPLATE_OPTIONS_MISSING,
        slug: "lock-template-options-missing",
        severity: "error",
        description: "World template header has no lock_template_options",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const pack of context.model.packs) {
            if (pack.type !== WorldLimits.PACK_TYPE) {
                continue;
            }

            const manifest = await ManifestLoader.read(context.loaders, pack);
            const formatVersion = ManifestLoader.formatVersion(manifest);

            if (manifest === undefined || formatVersion === undefined || formatVersion < WorldLimits.LOCK_TEMPLATE_OPTIONS_FORMAT_VERSION) {
                continue;
            }

            if (JsonLoader.get(manifest, "header", "lock_template_options") !== undefined) {
                continue;
            }

            findings.push(
                this.finding("World template header has no lock_template_options", pack.manifestPath, pack.root, {
                    field: "header.lock_template_options",
                })
            );
        }

        return findings;
    }
}
