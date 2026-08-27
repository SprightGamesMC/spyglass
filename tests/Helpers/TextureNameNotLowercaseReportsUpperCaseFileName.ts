import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { TextureNameNotLowercaseReportsUpperCaseFileNameCase } from "../Types/TextureNameNotLowercaseReportsUpperCaseFileNameTypes.js";
import TextureNameNotLowercase from "../../src/Checks/Persona/TextureNameNotLowercase.js";
import ImageBytes from "./Core/ImageBytes.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class TextureNameNotLowercaseReportsUpperCaseFileName {
    static readonly ID = "PERSONA/206";
    static readonly CASES: readonly TextureNameNotLowercaseReportsUpperCaseFileNameCase[] = [
        { name: "spright_hat.png texture name is all lower case", files: PersonaFixture.pieceFiles({}), expectedIds: [] },
        {
            name: "Spright_Hat.png texture name has upper case letters",
            files: PersonaFixture.pieceFiles({
                textures: { ...PersonaFixture.defaultTextures(), "Spright_Hat.png": ImageBytes.png({ width: 128, height: 128 }) },
            }),
            expectedIds: ["PERSONA/206"],
            expectedPaths: [PersonaFixture.path("Spright_Hat.png")],
        },
    ];

    static run(entry: TextureNameNotLowercaseReportsUpperCaseFileNameCase): Promise<FindingSummary> {
        return PersonaFixture.summary(new TextureNameNotLowercase(), entry.files, entry.contentType ?? "persona");
    }
}
