import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { SettingDefaultInvalidReportsDefaultOutsideRangeOrOptionsCase } from "../Types/SettingDefaultInvalidReportsDefaultOutsideRangeOrOptionsTypes.js";
import SettingDefaultInvalid from "../../src/Checks/Manifest/SettingDefaultInvalid.js";
import ManifestFixture from "./Manifest/ManifestFixture.js";

export default abstract class SettingDefaultInvalidReportsDefaultOutsideRangeOrOptions {
    static readonly ID = "MANIFEST/217";
    static readonly CASES: readonly SettingDefaultInvalidReportsDefaultOutsideRangeOrOptionsCase[] = [
        {
            name: "toggle, slider and dropdown defaults are inside their range or options",
            files: ManifestFixture.behaviorWithSettings(ManifestFixture.VALID_SETTINGS),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "slider default 50 is above max 10",
            files: ManifestFixture.behaviorWithSettings([{ ...ManifestFixture.SLIDER, default: 50 }]),
            expectedIds: ["MANIFEST/217"],
            expectedPaths: ["BP/manifest.json"],
        },
        {
            name: "slider default string 5 is not a number",
            files: ManifestFixture.behaviorWithSettings([{ ...ManifestFixture.SLIDER, default: "5" }]),
            expectedIds: ["MANIFEST/217"],
            expectedPaths: ["BP/manifest.json"],
        },
        {
            name: "dropdown default three is not one of its options",
            files: ManifestFixture.behaviorWithSettings([{ ...ManifestFixture.DROPDOWN, default: "three" }]),
            expectedIds: ["MANIFEST/217"],
            expectedPaths: ["BP/manifest.json"],
        },
    ];

    static async run(entry: SettingDefaultInvalidReportsDefaultOutsideRangeOrOptionsCase): Promise<FindingSummary> {
        return ManifestFixture.run(new SettingDefaultInvalid(), entry);
    }
}
