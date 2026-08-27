import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import type { JsonObject } from "../../Types/LoaderTypes.js";
import GeometryReader from "../../Loaders/GeometryReader.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";
import Check from "../Check.js";
import ModelChecks from "./ModelChecks.js";
import ModelLimits from "./ModelLimits.js";

export default class MeshNotAllowed extends Check {
    readonly definition: CheckDefinition = {
        group: ModelChecks.GROUP,
        number: ModelChecks.MESH_NOT_ALLOWED,
        slug: "mesh-not-allowed",
        severity: "error",
        description: "Geometry bone uses poly_mesh or texture_mesh",
    };

    private static meshField(bone: JsonObject): string | undefined {
        return ModelLimits.MESH_FIELDS.find((field) => bone[field] !== undefined);
    }

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const { pack, item } of PackItemLoader.select(context.model, ModelLimits.KINDS)) {
            for (const geometry of await GeometryReader.read(context, item.path)) {
                for (const bone of geometry.bones) {
                    const field = MeshNotAllowed.meshField(bone);

                    if (field === undefined) {
                        continue;
                    }

                    const name = typeof bone["name"] === "string" ? bone["name"] : "unnamed";

                    findings.push(
                        this.finding(
                            "Bone " + name + " in " + geometry.identifier + " uses " + field + ", only cubes are allowed",
                            item.path,
                            pack.root,
                            { field: geometry.identifier + ".bones." + name + "." + field }
                        )
                    );
                }
            }
        }

        return findings;
    }
}
