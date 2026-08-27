import type { Finding } from "../../src/Types/CheckTypes.js";
import type { GeometryIdentifierInvalidReportsMalformedIdCase } from "../Types/GeometryIdentifierInvalidReportsMalformedIdTypes.js";
import GeometryIdentifierInvalid from "../../src/Checks/Persona/GeometryIdentifierInvalid.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class GeometryIdentifierInvalidReportsMalformedId {
    static readonly ID = "PERSONA/212";
    static readonly CASES: readonly GeometryIdentifierInvalidReportsMalformedIdCase[] = [
        {
            name: "geometry.spright_hat.tall.slim.left.head_top has every segment in the expected form",
            files: PersonaFixture.pieceFiles({
                metaOverrides: { geometry_sources: [{ geometry: "geometry.spright_hat.tall.slim.left.head_top" }] },
            }),
            expectedIds: [],
        },
        {
            name: "geometry.spright_hat.huge has huge which is not a body size",
            files: PersonaFixture.pieceFiles({ metaOverrides: { geometry_sources: [{ geometry: "geometry.spright_hat.huge" }] } }),
            expectedIds: ["PERSONA/212"],
        },
        {
            name: "spright_hat.tall lacks the geometry prefix",
            files: PersonaFixture.pieceFiles({ metaOverrides: { geometry_sources: [{ geometry: "spright_hat.tall" }] } }),
            expectedIds: ["PERSONA/212"],
        },
    ];

    static run(entry: GeometryIdentifierInvalidReportsMalformedIdCase): Promise<Finding[]> {
        return PersonaFixture.run(new GeometryIdentifierInvalid(), entry.files, entry.contentType ?? "persona");
    }
}
