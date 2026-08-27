import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { TieringInvalidForVibrantVisualsReportsPbrPackOverTierTwoLimitCase } from "../Types/TieringInvalidForVibrantVisualsReportsPbrPackOverTierTwoLimitTypes.js";
import TieringInvalidForVibrantVisuals from "../../src/Checks/Texture/TieringInvalidForVibrantVisuals.js";
import TextureFixture from "./Core/TextureFixture.js";

export default abstract class TieringInvalidForVibrantVisualsReportsPbrPackOverTierTwoLimit {
    static readonly ID = "TEXTURE/203";
    static readonly CASES: readonly TieringInvalidForVibrantVisualsReportsPbrPackOverTierTwoLimitCase[] = [
        {
            name: "64 MiB pbr pack is under the 225 MiB tier 2 limit",
            files: TextureFixture.resourcePack({ "textures/entity/big.jpg": TextureFixture.image(4096, 4096) }, { capabilities: ["pbr"] }),
            expectedIds: [],
        },
        {
            name: "256 MiB pack without the pbr capability is not checked against the tier 2 limit",
            files: TextureFixture.resourcePack({ "textures/entity/big.jpg": TextureFixture.image(8192, 8192) }),
            expectedIds: [],
        },
        {
            name: "256 MiB pbr pack is over the 225 MiB tier 2 limit",
            files: TextureFixture.resourcePack({ "textures/entity/big.jpg": TextureFixture.image(8192, 8192) }, { capabilities: ["pbr"] }),
            expectedIds: [TieringInvalidForVibrantVisualsReportsPbrPackOverTierTwoLimit.ID],
            expectedPaths: ["RP/manifest.json"],
        },
    ];

    static run(entry: TieringInvalidForVibrantVisualsReportsPbrPackOverTierTwoLimitCase): Promise<FindingSummary> {
        return TextureFixture.summary(new TieringInvalidForVibrantVisuals(), entry);
    }
}
