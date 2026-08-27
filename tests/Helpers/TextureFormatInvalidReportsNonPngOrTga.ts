import type { Finding } from "../../src/Types/CheckTypes.js";
import type { TextureFormatInvalidReportsNonPngOrTgaCase } from "../Types/TextureFormatInvalidReportsNonPngOrTgaTypes.js";
import TextureFormatInvalid from "../../src/Checks/Persona/TextureFormatInvalid.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class TextureFormatInvalidReportsNonPngOrTga {
    static readonly ID = "PERSONA/207";
    static readonly CASES: readonly TextureFormatInvalidReportsNonPngOrTgaCase[] = [
        {
            name: "spright_hat.png texture with spright_hat_tint.tga tint map are PNG or TGA",
            files: PersonaFixture.pieceFiles({
                metaOverrides: { texture_sources: [{ texture: "spright_hat.png", tint_map: "spright_hat_tint.tga" }] },
            }),
            expectedIds: [],
        },
        {
            name: "spright_hat.jpg texture is not PNG or TGA",
            files: PersonaFixture.pieceFiles({ metaOverrides: { texture_sources: [{ texture: "spright_hat.jpg" }] } }),
            expectedIds: ["PERSONA/207"],
        },
    ];

    static run(entry: TextureFormatInvalidReportsNonPngOrTgaCase): Promise<Finding[]> {
        return PersonaFixture.run(new TextureFormatInvalid(), entry.files, entry.contentType ?? "persona");
    }
}
