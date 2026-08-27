import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { TotalOverAbsoluteLimitReportsAddonOverTierFiveLimitCase } from "../Types/TotalOverAbsoluteLimitReportsAddonOverTierFiveLimitTypes.js";
import TotalOverAbsoluteLimit from "../../src/Checks/Texture/TotalOverAbsoluteLimit.js";
import TextureFixture from "./Core/TextureFixture.js";

export default abstract class TotalOverAbsoluteLimitReportsAddonOverTierFiveLimit {
    static readonly ID = "TEXTURE/408";
    static readonly CASES: readonly TotalOverAbsoluteLimitReportsAddonOverTierFiveLimitCase[] = [
        {
            name: "256 MiB addon is under the 800 MiB tier 5 limit",
            files: TextureFixture.resourcePack({ "textures/entity/big.jpg": TextureFixture.image(8192, 8192) }),
            expectedIds: [],
        },
        {
            name: "1024 MiB addon is over the 800 MiB tier 5 limit",
            files: TextureFixture.resourcePack({ "textures/entity/big.jpg": TextureFixture.image(16384, 16384) }),
            expectedIds: [TotalOverAbsoluteLimitReportsAddonOverTierFiveLimit.ID],
            expectedPaths: ["RP/manifest.json"],
        },
    ];

    static run(entry: TotalOverAbsoluteLimitReportsAddonOverTierFiveLimitCase): Promise<FindingSummary> {
        return TextureFixture.summary(new TotalOverAbsoluteLimit(), entry);
    }
}
