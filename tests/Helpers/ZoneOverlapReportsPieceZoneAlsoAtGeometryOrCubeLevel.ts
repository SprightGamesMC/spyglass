import type { Finding } from "../../src/Types/CheckTypes.js";
import type { ZoneOverlapReportsPieceZoneAlsoAtGeometryOrCubeLevelCase } from "../Types/ZoneOverlapReportsPieceZoneAlsoAtGeometryOrCubeLevelTypes.js";
import ZoneOverlap from "../../src/Checks/Persona/ZoneOverlap.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class ZoneOverlapReportsPieceZoneAlsoAtGeometryOrCubeLevel {
    static readonly ID = "PERSONA/602";
    static readonly CASES: readonly ZoneOverlapReportsPieceZoneAlsoAtGeometryOrCubeLevelCase[] = [
        {
            name: "piece zone head_top with geometry zone head_front and cube zone head_back do not overlap",
            files: PersonaFixture.pieceFiles({
                metaOverrides: { zone: ["head_top"], geometry_sources: [{ geometry: "geometry.spright_hat.tall", zone: "head_front" }] },
                geometry: PersonaFixture.pieceGeometry(PersonaFixture.geometryIdentifiers(), "head_back"),
            }),
            expectedIds: [],
        },
        {
            name: "piece zone head_top repeated at geometry level overlaps",
            files: PersonaFixture.pieceFiles({
                metaOverrides: { zone: ["head_top"], geometry_sources: [{ geometry: "geometry.spright_hat.tall", zone: ["head_top"] }] },
            }),
            expectedIds: ["PERSONA/602"],
        },
        {
            name: "piece zone head_top repeated at cube level overlaps",
            files: PersonaFixture.pieceFiles({
                metaOverrides: { zone: ["head_top"] },
                geometry: PersonaFixture.pieceGeometry(PersonaFixture.geometryIdentifiers(), "head_top"),
            }),
            expectedIds: ["PERSONA/602"],
        },
    ];

    static run(entry: ZoneOverlapReportsPieceZoneAlsoAtGeometryOrCubeLevelCase): Promise<Finding[]> {
        return PersonaFixture.run(new ZoneOverlap(), entry.files, entry.contentType ?? "persona");
    }
}
