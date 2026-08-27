import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import Check from "../Check.js";
import PersonaChecks from "./PersonaChecks.js";

export default class GeometryUnreferenced extends Check {
    readonly definition: CheckDefinition = {
        group: PersonaChecks.GROUP,
        number: PersonaChecks.GEOMETRY_UNREFERENCED,
        slug: "geometry-unreferenced",
        severity: "warning",
        description: "Geometry id in the geometry file is not listed in the meta",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const data of await PersonaLoader.pieces(context)) {
            if (data.meta === undefined) {
                continue;
            }

            const referenced = new Set(
                PersonaLoader.geometrySources(data.meta)
                    .map((source) => PersonaLoader.string(source.entry, "geometry"))
                    .filter((identifier): identifier is string => identifier !== undefined)
            );

            for (const definition of data.geometry) {
                if (referenced.has(definition.identifier)) {
                    continue;
                }

                findings.push(
                    this.finding("Geometry id " + definition.identifier + " is not listed in the meta", definition.path, data.pack.root)
                );
            }
        }

        return findings;
    }
}
