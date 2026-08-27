import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import SkinPackLoader from "../../Loaders/SkinPackLoader.js";
import Check from "../Check.js";
import SkinChecks from "./SkinChecks.js";

export default class SkinsJsonMissing extends Check {
    readonly definition: CheckDefinition = {
        group: SkinChecks.GROUP,
        number: SkinChecks.SKINS_JSON_MISSING,
        slug: "skins-json-missing",
        severity: "error",
        description: "Pack has no skins.json",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const pack of SkinPackLoader.skinPacks(context)) {
            if (SkinPackLoader.skinsJsonItem(pack) !== undefined) {
                continue;
            }

            findings.push(this.finding("Skin pack has no skins.json", pack.manifestPath, pack.root));
        }

        return findings;
    }
}
