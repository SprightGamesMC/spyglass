import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import JsonLoader from "../../Loaders/JsonLoader.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import Check from "../Check.js";
import AddonChecks from "./AddonChecks.js";
import AddonLimits from "./AddonLimits.js";
import AddonNaming from "./AddonNaming.js";

export default class MaterialIdentifierInvalid extends Check {
    static readonly MATERIALS_KEY = "materials";

    readonly definition: CheckDefinition = {
        group: AddonChecks.GROUP,
        number: AddonChecks.MATERIAL_IDENTIFIER_INVALID,
        slug: "material-identifier-invalid",
        severity: "error",
        description: "Material key is not namespaced or is generic",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const entry of PackItemLoader.select(context.model, ["material"])) {
            const materials = JsonLoader.get(
                await context.loaders.json.readObject(entry.item.path),
                MaterialIdentifierInvalid.MATERIALS_KEY
            );

            if (!JsonLoader.isObject(materials)) {
                continue;
            }

            for (const key of Object.keys(materials)) {
                const first = key.split(AddonNaming.NAMESPACE_SEPARATOR)[0];

                if (first === AddonLimits.MATERIAL_VERSION_KEY) {
                    continue;
                }

                if (AddonNaming.isNamespaced(first) && !AddonNaming.isGenericMaterialName(first)) {
                    continue;
                }

                findings.push(
                    this.finding(
                        "Material key " + key + " first segment is not in creatorshortname_projectshortname_materialname form",
                        entry.item.path,
                        entry.pack.root,
                        { field: MaterialIdentifierInvalid.MATERIALS_KEY + "." + key }
                    )
                );
            }
        }

        return findings;
    }
}
