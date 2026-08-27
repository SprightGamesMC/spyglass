import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { SettingRangeInvalidReportsInconsistentSliderCase } from "../Types/SettingRangeInvalidReportsInconsistentSliderTypes.js";
import SettingRangeInvalid from "../../src/Checks/Manifest/SettingRangeInvalid.js";
import ManifestFixture from "./Manifest/ManifestFixture.js";

export default abstract class SettingRangeInvalidReportsInconsistentSlider {
    static readonly ID = "MANIFEST/216";
    static readonly CASES: readonly SettingRangeInvalidReportsInconsistentSliderCase[] = [
        {
            name: "slider min 0 max 10 step 1 is a consistent range",
            files: ManifestFixture.behaviorWithSettings(ManifestFixture.VALID_SETTINGS),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "slider min 10 above max 0 is an inconsistent range",
            files: ManifestFixture.behaviorWithSettings([{ ...ManifestFixture.SLIDER, min: 10, max: 0 }]),
            expectedIds: ["MANIFEST/216"],
            expectedPaths: ["BP/manifest.json"],
        },
        {
            name: "slider step 0 cannot step through the range",
            files: ManifestFixture.behaviorWithSettings([{ ...ManifestFixture.SLIDER, step: 0 }]),
            expectedIds: ["MANIFEST/216"],
            expectedPaths: ["BP/manifest.json"],
        },
        {
            name: "slider step 11 is larger than the 0 to 10 range",
            files: ManifestFixture.behaviorWithSettings([{ ...ManifestFixture.SLIDER, step: 11 }]),
            expectedIds: ["MANIFEST/216"],
            expectedPaths: ["BP/manifest.json"],
        },
    ];

    static async run(entry: SettingRangeInvalidReportsInconsistentSliderCase): Promise<FindingSummary> {
        return ManifestFixture.run(new SettingRangeInvalid(), entry);
    }
}
