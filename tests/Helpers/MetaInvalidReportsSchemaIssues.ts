import type { Finding } from "../../src/Types/CheckTypes.js";
import type { MetaInvalidReportsSchemaIssuesCase } from "../Types/MetaInvalidReportsSchemaIssuesTypes.js";
import MetaInvalid from "../../src/Checks/Persona/MetaInvalid.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class MetaInvalidReportsSchemaIssues {
    static readonly ID = "PERSONA/201";
    static readonly CASES: readonly MetaInvalidReportsSchemaIssuesCase[] = [
        { name: "meta with only known keys of the right types matches the schema", files: PersonaFixture.pieceFiles({}), expectedIds: [] },
        {
            name: "meta root key extra_key is not in the schema",
            files: PersonaFixture.pieceFiles({ metaOverrides: { extra_key: 1 } }),
            expectedIds: ["PERSONA/201"],
        },
        {
            name: "texture_sources entry with a numeric texture and an unknown color key breaks the schema twice",
            files: PersonaFixture.pieceFiles({ metaOverrides: { texture_sources: [{ texture: 5, color: "red" }] } }),
            expectedIds: PersonaFixture.repeat("PERSONA/201", 2),
        },
    ];

    static run(entry: MetaInvalidReportsSchemaIssuesCase): Promise<Finding[]> {
        return PersonaFixture.run(new MetaInvalid(), entry.files, entry.contentType ?? "persona");
    }
}
