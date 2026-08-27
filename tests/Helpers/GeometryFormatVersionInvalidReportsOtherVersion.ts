import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { GeometryFormatVersionInvalidReportsOtherVersionCase } from "../Types/GeometryFormatVersionInvalidReportsOtherVersionTypes.js";
import GeometryFormatVersionInvalid from "../../src/Checks/Persona/GeometryFormatVersionInvalid.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class GeometryFormatVersionInvalidReportsOtherVersion {
    static readonly ID = "PERSONA/501";
    static readonly CASES: readonly GeometryFormatVersionInvalidReportsOtherVersionCase[] = [
        { name: "geometry format_version 1.8.0 is the required version", files: PersonaFixture.pieceFiles({}), expectedIds: [] },
        {
            name: "geometry format_version 1.12.0 is not 1.8.0",
            files: PersonaFixture.pieceFiles({ geometry: { ...PersonaFixture.pieceGeometry(), format_version: "1.12.0" } }),
            expectedIds: ["PERSONA/501"],
            expectedPaths: [PersonaFixture.geometryPath()],
        },
    ];

    static run(entry: GeometryFormatVersionInvalidReportsOtherVersionCase): Promise<FindingSummary> {
        return PersonaFixture.summary(new GeometryFormatVersionInvalid(), entry.files, entry.contentType ?? "persona");
    }
}
