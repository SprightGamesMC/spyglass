import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { GeometryUnreferencedReportsUnnamedIdCase } from "../Types/GeometryUnreferencedReportsUnnamedIdTypes.js";
import GeometryUnreferenced from "../../src/Checks/Persona/GeometryUnreferenced.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class GeometryUnreferencedReportsUnnamedId {
    static readonly ID = "PERSONA/304";
    static readonly CASES: readonly GeometryUnreferencedReportsUnnamedIdCase[] = [
        { name: "every geometry file id is listed in the meta", files: PersonaFixture.pieceFiles({}), expectedIds: [] },
        {
            name: "geometry.spright_hat.tall.slim in the geometry file is not listed in the meta",
            files: PersonaFixture.pieceFiles({
                geometry: PersonaFixture.pieceGeometry([...PersonaFixture.geometryIdentifiers(), "geometry.spright_hat.tall.slim"]),
            }),
            expectedIds: ["PERSONA/304"],
            expectedPaths: [PersonaFixture.geometryPath()],
        },
    ];

    static run(entry: GeometryUnreferencedReportsUnnamedIdCase): Promise<FindingSummary> {
        return PersonaFixture.summary(new GeometryUnreferenced(), entry.files, entry.contentType ?? "persona");
    }
}
