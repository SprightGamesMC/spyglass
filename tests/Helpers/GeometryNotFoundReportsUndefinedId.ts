import type { Finding } from "../../src/Types/CheckTypes.js";
import type { GeometryNotFoundReportsUndefinedIdCase } from "../Types/GeometryNotFoundReportsUndefinedIdTypes.js";
import GeometryNotFound from "../../src/Checks/Persona/GeometryNotFound.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class GeometryNotFoundReportsUndefinedId {
    static readonly ID = "PERSONA/302";
    static readonly CASES: readonly GeometryNotFoundReportsUndefinedIdCase[] = [
        { name: "every meta geometry id is defined in the geometry file", files: PersonaFixture.pieceFiles({}), expectedIds: [] },
        {
            name: "geometry file defining only the tall id leaves three meta ids undefined",
            files: PersonaFixture.pieceFiles({ geometry: PersonaFixture.pieceGeometry(["geometry.spright_hat.tall"]) }),
            expectedIds: PersonaFixture.repeat("PERSONA/302", 3),
        },
        {
            name: "ids under minecraft:geometry descriptions count as defined",
            files: PersonaFixture.pieceFiles({
                geometry: {
                    format_version: "1.8.0",
                    "minecraft:geometry": PersonaFixture.geometryIdentifiers().map((identifier) => ({ description: { identifier } })),
                },
            }),
            expectedIds: [],
        },
    ];

    static run(entry: GeometryNotFoundReportsUndefinedIdCase): Promise<Finding[]> {
        return PersonaFixture.run(new GeometryNotFound(), entry.files, entry.contentType ?? "persona");
    }
}
