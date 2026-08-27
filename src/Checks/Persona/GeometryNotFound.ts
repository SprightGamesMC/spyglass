import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import Check from "../Check.js";
import PersonaChecks from "./PersonaChecks.js";

export default class GeometryNotFound extends Check {
    readonly definition: CheckDefinition = {
        group: PersonaChecks.GROUP,
        number: PersonaChecks.GEOMETRY_NOT_FOUND,
        slug: "geometry-not-found",
        severity: "error",
        description: "Meta geometry id is not defined in the geometry file",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const data of await PersonaLoader.pieces(context)) {
            if (data.metaPath === undefined) {
                continue;
            }

            const defined = new Set(data.geometry.map((definition) => definition.identifier));

            for (const source of PersonaLoader.geometrySources(data.meta)) {
                const identifier = PersonaLoader.string(source.entry, "geometry");

                if (identifier === undefined || defined.has(identifier)) {
                    continue;
                }

                findings.push(
                    this.finding("Geometry id " + identifier + " is not defined in a geometry file", data.metaPath, data.pack.root, {
                        field: source.field + ".geometry",
                    })
                );
            }
        }

        return findings;
    }
}
