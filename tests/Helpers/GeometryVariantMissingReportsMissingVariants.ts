import type { Finding } from "../../src/Types/CheckTypes.js";
import type { GeometryVariantMissingReportsMissingVariantsCase } from "../Types/GeometryVariantMissingReportsMissingVariantsTypes.js";
import GeometryVariantMissing from "../../src/Checks/Persona/GeometryVariantMissing.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class GeometryVariantMissingReportsMissingVariants {
    static readonly ID = "PERSONA/105";
    static readonly CASES: readonly GeometryVariantMissingReportsMissingVariantsCase[] = [
        {
            name: "persona_head with tall medium small and smaller has every body size",
            files: PersonaFixture.pieceFiles({}),
            expectedIds: [],
        },
        {
            name: "persona_head with only tall and medium is missing two body sizes",
            files: PersonaFixture.pieceFiles({
                metaOverrides: {
                    geometry_sources: [
                        { geometry: "geometry.spright_hat.tall", body_size: "tall" },
                        { geometry: "geometry.spright_hat.medium", body_size: "medium" },
                    ],
                },
            }),
            expectedIds: PersonaFixture.repeat("PERSONA/105", 2),
        },
        {
            name: "persona_arms with every body size and no arm_size or side counts as covering all variants",
            files: PersonaFixture.pieceFiles({
                metaOverrides: {
                    piece_type: "persona_arms",
                    geometry_sources: PersonaFixture.BODY_SIZES.map((size) => ({
                        geometry: "geometry.spright_hat." + size,
                        body_size: size,
                    })),
                },
            }),
            expectedIds: [],
        },
        {
            name: "persona_legs with only the right side is missing the left side for each body size",
            files: PersonaFixture.pieceFiles({
                metaOverrides: {
                    piece_type: "persona_legs",
                    geometry_sources: PersonaFixture.BODY_SIZES.map((size) => ({
                        geometry: "geometry.spright_hat." + size,
                        body_size: size,
                        side: "right",
                    })),
                },
            }),
            expectedIds: PersonaFixture.repeat("PERSONA/105", 4),
        },
        {
            name: "persona_hand with only wide arms is missing the slim arm size for each body size",
            files: PersonaFixture.pieceFiles({
                metaOverrides: {
                    piece_type: "persona_hand",
                    geometry_sources: PersonaFixture.BODY_SIZES.map((size) => ({
                        geometry: "geometry.spright_hat." + size,
                        body_size: size,
                        arm_size: "wide",
                    })),
                },
            }),
            expectedIds: PersonaFixture.repeat("PERSONA/105", 4),
        },
    ];

    static run(entry: GeometryVariantMissingReportsMissingVariantsCase): Promise<Finding[]> {
        return PersonaFixture.run(new GeometryVariantMissing(), entry.files, entry.contentType ?? "persona");
    }
}
