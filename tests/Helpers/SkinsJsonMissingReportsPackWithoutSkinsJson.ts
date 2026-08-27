import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { SkinsJsonMissingReportsPackWithoutSkinsJsonCase } from "../Types/SkinsJsonMissingReportsPackWithoutSkinsJsonTypes.js";
import SkinsJsonMissing from "../../src/Checks/Skin/SkinsJsonMissing.js";
import SkinPackFixture from "./Core/SkinPackFixture.js";

export default abstract class SkinsJsonMissingReportsPackWithoutSkinsJson {
    static readonly ID = "SKIN/101";
    static readonly CASES: readonly SkinsJsonMissingReportsPackWithoutSkinsJsonCase[] = [
        { name: "skin pack with skins.json has its skin list", expectedIds: [], expectedPaths: [] },
        {
            name: "skin pack without skins.json has no skin list",
            omitSkinsJson: true,
            expectedIds: ["SKIN/101"],
            expectedPaths: [SkinPackFixture.MANIFEST_PATH],
        },
    ];

    static run(entry: SkinsJsonMissingReportsPackWithoutSkinsJsonCase): Promise<FindingSummary> {
        return SkinPackFixture.run(new SkinsJsonMissing(), entry);
    }
}
