import type { Finding } from "../../src/Types/CheckTypes.js";
import type { CoverageTooLowCase } from "../Types/CoverageTooLowReportsUnderNinetyFivePercentTypes.js";
import CoverageTooLow from "../../src/Checks/TexturePack/CoverageTooLow.js";
import TextureFixture from "./Core/TextureFixture.js";
import VanillaTextureFixture from "./Core/VanillaTextureFixture.js";

export default abstract class CoverageTooLowReportsUnderNinetyFivePercent {
    static readonly ID = "TEXTUREPACK/401";
    static readonly CASES: readonly CoverageTooLowCase[] = [
        {
            name: "stone and dirt overridden is 100 percent coverage which is at or above 95 percent",
            files: VanillaTextureFixture.fullCoverage(),
            options: VanillaTextureFixture.OPTIONS,
            expectedIds: [],
        },
        {
            name: "only stone overridden is 50 percent coverage which is under 95 percent",
            files: VanillaTextureFixture.stoneOnly(),
            options: VanillaTextureFixture.OPTIONS,
            expectedIds: [CoverageTooLowReportsUnderNinetyFivePercent.ID],
        },
    ];

    static run(entry: CoverageTooLowCase): Promise<Finding[]> {
        return TextureFixture.run(new CoverageTooLow(), entry);
    }
}
