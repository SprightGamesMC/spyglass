import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { LocalizationNameMismatchReportsDifferingNamesCase } from "../Types/LocalizationNameMismatchReportsDifferingNamesTypes.js";
import LocalizationNameMismatch from "../../src/Checks/Skin/LocalizationNameMismatch.js";
import SkinPackFixture from "./Core/SkinPackFixture.js";

export default abstract class LocalizationNameMismatchReportsDifferingNames {
    static readonly ID = "SKIN/202";
    static readonly CASES: readonly LocalizationNameMismatchReportsDifferingNamesCase[] = [
        { name: "localization_name sample_skin_pack equals serialize_name", expectedIds: [], expectedPaths: [] },
        {
            name: "localization_name other_name differs from serialize_name sample_skin_pack",
            skinsJson: SkinPackFixture.skinsJson(undefined, { localization_name: "other_name" }),
            expectedIds: ["SKIN/202"],
            expectedPaths: [SkinPackFixture.SKINS_JSON_PATH],
        },
    ];

    static run(entry: LocalizationNameMismatchReportsDifferingNamesCase): Promise<FindingSummary> {
        return SkinPackFixture.run(new LocalizationNameMismatch(), entry);
    }
}
