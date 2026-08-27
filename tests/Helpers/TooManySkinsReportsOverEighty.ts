import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { TooManySkinsReportsOverEightyCase } from "../Types/TooManySkinsReportsOverEightyTypes.js";
import TooManySkins from "../../src/Checks/Skin/TooManySkins.js";
import SkinPackFixture from "./Core/SkinPackFixture.js";

export default abstract class TooManySkinsReportsOverEighty {
    static readonly ID = "SKIN/401";
    static readonly CASES: readonly TooManySkinsReportsOverEightyCase[] = [
        {
            name: "80 skins is at the limit",
            skinsJson: SkinPackFixture.skinsJson(SkinPackFixture.paidSkins(80)),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "81 skins is above the limit",
            skinsJson: SkinPackFixture.skinsJson(SkinPackFixture.paidSkins(81)),
            expectedIds: ["SKIN/401"],
            expectedPaths: [SkinPackFixture.SKINS_JSON_PATH],
        },
    ];

    static run(entry: TooManySkinsReportsOverEightyCase): Promise<FindingSummary> {
        return SkinPackFixture.run(new TooManySkins(), entry);
    }
}
