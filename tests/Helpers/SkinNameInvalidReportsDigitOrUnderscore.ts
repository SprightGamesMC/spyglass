import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { SkinNameInvalidReportsDigitOrUnderscoreCase } from "../Types/SkinNameInvalidReportsDigitOrUnderscoreTypes.js";
import SkinNameInvalid from "../../src/Checks/Skin/SkinNameInvalid.js";
import SkinPackFixture from "./Core/SkinPackFixture.js";

export default abstract class SkinNameInvalidReportsDigitOrUnderscore {
    static readonly ID = "SKIN/208";
    static readonly CASES: readonly SkinNameInvalidReportsDigitOrUnderscoreCase[] = [
        {
            name: "skin localization_name KnightTwo has only letters",
            skinsJson: SkinPackFixture.skinsJson([SkinPackFixture.skin({ localization_name: "KnightTwo" })]),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "skin localization_name knight_2 has an underscore and a digit",
            skinsJson: SkinPackFixture.skinsJson([SkinPackFixture.skin({ localization_name: "knight_2" })]),
            expectedIds: ["SKIN/208"],
            expectedPaths: [SkinPackFixture.SKINS_JSON_PATH],
        },
        {
            name: "pack level localization_name with an underscore is not checked",
            skinsJson: SkinPackFixture.skinsJson([SkinPackFixture.skin({ localization_name: "Knight" })], {
                localization_name: "sample_skin_pack",
            }),
            expectedIds: [],
            expectedPaths: [],
        },
    ];

    static run(entry: SkinNameInvalidReportsDigitOrUnderscoreCase): Promise<FindingSummary> {
        return SkinPackFixture.run(new SkinNameInvalid(), entry);
    }
}
