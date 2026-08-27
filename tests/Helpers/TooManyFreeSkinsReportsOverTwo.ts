import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { TooManyFreeSkinsReportsOverTwoCase } from "../Types/TooManyFreeSkinsReportsOverTwoTypes.js";
import TooManyFreeSkins from "../../src/Checks/Skin/TooManyFreeSkins.js";
import SkinPackFixture from "./Core/SkinPackFixture.js";

export default abstract class TooManyFreeSkinsReportsOverTwo {
    static readonly ID = "SKIN/402";
    static readonly CASES: readonly TooManyFreeSkinsReportsOverTwoCase[] = [
        {
            name: "2 free skins is at the limit",
            skinsJson: SkinPackFixture.skinsJson(SkinPackFixture.freeSkins(2)),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "3 free skins is above the limit",
            skinsJson: SkinPackFixture.skinsJson(SkinPackFixture.freeSkins(3)),
            expectedIds: ["SKIN/402"],
            expectedPaths: [SkinPackFixture.SKINS_JSON_PATH],
        },
    ];

    static run(entry: TooManyFreeSkinsReportsOverTwoCase): Promise<FindingSummary> {
        return SkinPackFixture.run(new TooManyFreeSkins(), entry);
    }
}
