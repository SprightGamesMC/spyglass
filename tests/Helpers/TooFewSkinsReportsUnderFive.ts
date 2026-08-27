import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { TooFewSkinsReportsUnderFiveCase } from "../Types/TooFewSkinsReportsUnderFiveTypes.js";
import TooFewSkins from "../../src/Checks/Skin/TooFewSkins.js";
import SkinPackFixture from "./Core/SkinPackFixture.js";

export default abstract class TooFewSkinsReportsUnderFive {
    static readonly ID = "SKIN/403";
    static readonly CASES: readonly TooFewSkinsReportsUnderFiveCase[] = [
        {
            name: "5 skins is at the minimum",
            skinsJson: SkinPackFixture.skinsJson(SkinPackFixture.paidSkins(5)),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "4 skins is below the minimum",
            skinsJson: SkinPackFixture.skinsJson(SkinPackFixture.paidSkins(4)),
            expectedIds: ["SKIN/403"],
            expectedPaths: [SkinPackFixture.SKINS_JSON_PATH],
        },
    ];

    static run(entry: TooFewSkinsReportsUnderFiveCase): Promise<FindingSummary> {
        return SkinPackFixture.run(new TooFewSkins(), entry);
    }
}
