import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { TextureUnreferencedReportsUnnamedImageCase } from "../Types/TextureUnreferencedReportsUnnamedImageTypes.js";
import TextureUnreferenced from "../../src/Checks/Persona/TextureUnreferenced.js";
import ImageBytes from "./Core/ImageBytes.js";
import PersonaFixture from "./Core/PersonaFixture.js";

export default abstract class TextureUnreferencedReportsUnnamedImage {
    static readonly ID = "PERSONA/303";
    static readonly CASES: readonly TextureUnreferencedReportsUnnamedImageCase[] = [
        { name: "every image in the pack is listed in the meta", files: PersonaFixture.pieceFiles({}), expectedIds: [] },
        {
            name: "extra.png is not listed in the meta",
            files: PersonaFixture.pieceFiles({
                textures: { ...PersonaFixture.defaultTextures(), "extra.png": ImageBytes.png({ width: 8, height: 8 }) },
            }),
            expectedIds: ["PERSONA/303"],
            expectedPaths: [PersonaFixture.path("extra.png")],
        },
        {
            name: "pack_icon.png is exempt from being listed in the meta",
            files: PersonaFixture.pieceFiles({
                textures: { ...PersonaFixture.defaultTextures(), "pack_icon.png": ImageBytes.png({ width: 8, height: 8 }) },
            }),
            expectedIds: [],
        },
    ];

    static run(entry: TextureUnreferencedReportsUnnamedImageCase): Promise<FindingSummary> {
        return PersonaFixture.summary(new TextureUnreferenced(), entry.files, entry.contentType ?? "persona");
    }
}
