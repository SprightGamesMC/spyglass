import type { Finding } from "../../src/Types/CheckTypes.js";
import type { SourcesMissingReportsMetaWithoutSourcesCase } from "../Types/SourcesMissingReportsMetaWithoutSourcesTypes.js";
import SourcesMissing from "../../src/Checks/Persona/SourcesMissing.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class SourcesMissingReportsMetaWithoutSources {
    static readonly ID = "PERSONA/104";
    static readonly CASES: readonly SourcesMissingReportsMetaWithoutSourcesCase[] = [
        {
            name: "texture_sources and geometry_sources both present give the piece sources",
            files: PersonaFixture.pieceFiles({}),
            expectedIds: [],
        },
        {
            name: "texture_sources alone gives the piece a source",
            files: PersonaFixture.pieceFiles({ metaOverrides: { geometry_sources: undefined } }),
            expectedIds: [],
        },
        {
            name: "missing texture_sources and empty geometry_sources leave the piece without sources",
            files: PersonaFixture.pieceFiles({ metaOverrides: { texture_sources: undefined, geometry_sources: [] } }),
            expectedIds: ["PERSONA/104"],
        },
    ];

    static run(entry: SourcesMissingReportsMetaWithoutSourcesCase): Promise<Finding[]> {
        return PersonaFixture.run(new SourcesMissing(), entry.files, entry.contentType ?? "persona");
    }
}
