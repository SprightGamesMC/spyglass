import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import SkinPackLoader from "../../Loaders/SkinPackLoader.js";
import Check from "../Check.js";
import SkinChecks from "./SkinChecks.js";

export default class CapeNotAllowed extends Check {
    readonly definition: CheckDefinition = {
        group: SkinChecks.GROUP,
        number: SkinChecks.CAPE_NOT_ALLOWED,
        slug: "cape-not-allowed",
        severity: "error",
        description: "Skin has a cape",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const definition of await SkinPackLoader.load(context)) {
            for (const skin of definition.skins) {
                if (skin.cape === undefined) {
                    continue;
                }

                findings.push(
                    this.finding("Skin has cape " + skin.cape + ", capes are not allowed", definition.path, definition.pack.root, {
                        field: skin.field + ".cape",
                    })
                );
            }
        }

        return findings;
    }
}
