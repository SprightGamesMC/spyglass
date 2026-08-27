import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import ManifestLoader from "../../Loaders/ManifestLoader.js";
import Check from "../Check.js";
import PersonaChecks from "./PersonaChecks.js";
import PersonaLimits from "./PersonaLimits.js";

export default class ModuleTypeMismatch extends Check {
    readonly definition: CheckDefinition = {
        group: PersonaChecks.GROUP,
        number: PersonaChecks.MODULE_TYPE_MISMATCH,
        slug: "module-type-mismatch",
        severity: "error",
        description: "Manifest module type is not persona_piece",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const pack of context.model.packs) {
            const manifest = await ManifestLoader.read(context.loaders, pack);

            if (manifest === undefined || ManifestLoader.hasModuleType(manifest, PersonaLimits.MODULE_TYPE)) {
                continue;
            }

            const types = ManifestLoader.moduleTypes(manifest);
            const actual = types.length === 0 ? "no module type" : "module type " + types.join(", ");

            findings.push(
                this.finding("Manifest has " + actual + ", expected " + PersonaLimits.MODULE_TYPE, pack.manifestPath, pack.root, {
                    field: "modules",
                })
            );
        }

        return findings;
    }
}
