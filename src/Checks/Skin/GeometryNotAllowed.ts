import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import SkinPackLoader from "../../Loaders/SkinPackLoader.js";
import Check from "../Check.js";
import SkinChecks from "./SkinChecks.js";
import SkinLimits from "./SkinLimits.js";

export default class GeometryNotAllowed extends Check {
    readonly definition: CheckDefinition = {
        group: SkinChecks.GROUP,
        number: SkinChecks.GEOMETRY_NOT_ALLOWED,
        slug: "geometry-not-allowed",
        severity: "error",
        description: "Skin geometry is not a humanoid custom model",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const definition of await SkinPackLoader.load(context)) {
            for (const skin of definition.skins) {
                if (skin.geometry === undefined || SkinLimits.ALLOWED_GEOMETRIES.includes(skin.geometry)) {
                    continue;
                }

                findings.push(
                    this.finding(
                        "Skin geometry " + skin.geometry + " is not allowed, expected " + SkinLimits.ALLOWED_GEOMETRIES.join(" or "),
                        definition.path,
                        definition.pack.root,
                        { field: skin.field + ".geometry" }
                    )
                );
            }
        }

        return findings;
    }
}
