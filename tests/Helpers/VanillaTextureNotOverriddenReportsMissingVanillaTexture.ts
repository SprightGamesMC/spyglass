import type { Finding } from "../../src/Types/CheckTypes.js";
import type { VanillaTextureNotOverriddenCase } from "../Types/VanillaTextureNotOverriddenReportsMissingVanillaTextureTypes.js";
import VanillaTextureNotOverridden from "../../src/Checks/TexturePack/VanillaTextureNotOverridden.js";
import TextureFixture from "./Core/TextureFixture.js";
import VanillaTextureFixture from "./Core/VanillaTextureFixture.js";

export default abstract class VanillaTextureNotOverriddenReportsMissingVanillaTexture {
    static readonly ID = "TEXTUREPACK/301";
    static readonly CASES: readonly VanillaTextureNotOverriddenCase[] = [
        {
            name: "stone and dirt overridden includes every counted vanilla texture",
            files: VanillaTextureFixture.fullCoverage(),
            options: VanillaTextureFixture.OPTIONS,
            expectedIds: [],
        },
        {
            name: "only stone overridden leaves vanilla dirt not overridden",
            files: VanillaTextureFixture.stoneOnly(),
            options: VanillaTextureFixture.OPTIONS,
            expectedIds: [VanillaTextureNotOverriddenReportsMissingVanillaTexture.ID],
        },
    ];

    static run(entry: VanillaTextureNotOverriddenCase): Promise<Finding[]> {
        return TextureFixture.run(new VanillaTextureNotOverridden(), entry);
    }
}
