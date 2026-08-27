import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { SettingOptionsTooFewReportsSingleOptionDropdownCase } from "../Types/SettingOptionsTooFewReportsSingleOptionDropdownTypes.js";
import SettingOptionsTooFew from "../../src/Checks/Manifest/SettingOptionsTooFew.js";
import ManifestFixture from "./Manifest/ManifestFixture.js";

export default abstract class SettingOptionsTooFewReportsSingleOptionDropdown {
    static readonly ID = "MANIFEST/401";
    static readonly CASES: readonly SettingOptionsTooFewReportsSingleOptionDropdownCase[] = [
        {
            name: "dropdown with 2 options meets the minimum",
            files: ManifestFixture.behaviorWithSettings(ManifestFixture.VALID_SETTINGS),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "dropdown with 1 option is below the 2 option minimum",
            files: ManifestFixture.behaviorWithSettings([{ ...ManifestFixture.DROPDOWN, options: [{ name: "one", text: "One" }] }]),
            expectedIds: ["MANIFEST/401"],
            expectedPaths: ["BP/manifest.json"],
        },
    ];

    static async run(entry: SettingOptionsTooFewReportsSingleOptionDropdownCase): Promise<FindingSummary> {
        return ManifestFixture.run(new SettingOptionsTooFew(), entry);
    }
}
