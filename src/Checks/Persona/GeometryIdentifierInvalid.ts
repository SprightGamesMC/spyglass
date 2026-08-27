import type { CheckContext, CheckDefinition, Finding } from "../../Types/CheckTypes.js";
import PersonaLoader from "../../Loaders/PersonaLoader.js";
import Check from "../Check.js";
import PersonaChecks from "./PersonaChecks.js";

export default class GeometryIdentifierInvalid extends Check {
    readonly definition: CheckDefinition = {
        group: PersonaChecks.GROUP,
        number: PersonaChecks.GEOMETRY_IDENTIFIER_INVALID,
        slug: "geometry-identifier-invalid",
        severity: "error",
        description: "Geometry id is not in geometry.<name>.<body_size>[.<arm_size>][.<side>][.<zone>] form",
    };

    async run(context: CheckContext): Promise<Finding[]> {
        const findings: Finding[] = [];

        for (const data of await PersonaLoader.pieces(context)) {
            if (data.metaPath === undefined) {
                continue;
            }

            for (const source of PersonaLoader.geometrySources(data.meta)) {
                const identifier = PersonaLoader.string(source.entry, "geometry");

                if (identifier === undefined || PersonaLoader.parseGeometryIdentifier(identifier) !== undefined) {
                    continue;
                }

                findings.push(
                    this.finding(
                        "Geometry id " + identifier + " is not in geometry.<name>.<body_size>[.<arm_size>][.<side>][.<zone>] form",
                        data.metaPath,
                        data.pack.root,
                        { field: source.field + ".geometry" }
                    )
                );
            }
        }

        return findings;
    }
}
