import type { Finding } from "../../src/Types/CheckTypes.js";
import type { TextureNotFoundReportsMissingFileCase } from "../Types/TextureNotFoundReportsMissingFileTypes.js";
import TextureNotFound from "../../src/Checks/Persona/TextureNotFound.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class TextureNotFoundReportsMissingFile {
    static readonly ID = "PERSONA/301";
    static readonly CASES: readonly TextureNotFoundReportsMissingFileCase[] = [
        { name: "texture and tint map listed in the meta exist in the pack", files: PersonaFixture.pieceFiles({}), expectedIds: [] },
        {
            name: "missing.png texture and missing_tint.png tint map are not in the pack",
            files: PersonaFixture.pieceFiles({
                metaOverrides: { texture_sources: [{ texture: "missing.png", tint_map: "missing_tint.png" }] },
            }),
            expectedIds: PersonaFixture.repeat("PERSONA/301", 2),
        },
    ];

    static run(entry: TextureNotFoundReportsMissingFileCase): Promise<Finding[]> {
        return PersonaFixture.run(new TextureNotFound(), entry.files, entry.contentType ?? "persona");
    }
}
