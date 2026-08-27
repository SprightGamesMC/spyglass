import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { SettingOptionsDuplicateReportsRepeatedOptionNameCase } from "../Types/SettingOptionsDuplicateReportsRepeatedOptionNameTypes.js";
import SettingOptionsDuplicate from "../../src/Checks/Manifest/SettingOptionsDuplicate.js";
import ManifestFixture from "./Manifest/ManifestFixture.js";

export default abstract class SettingOptionsDuplicateReportsRepeatedOptionName {
    static readonly ID = "MANIFEST/606";
    static readonly CASES: readonly SettingOptionsDuplicateReportsRepeatedOptionNameCase[] = [
        {
            name: "dropdown options one and two are distinct names",
            files: ManifestFixture.behaviorWithSettings(ManifestFixture.VALID_SETTINGS),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "dropdown options both named one repeat an option name",
            files: ManifestFixture.behaviorWithSettings([
                {
                    ...ManifestFixture.DROPDOWN,
                    options: [
                        { name: "one", text: "One" },
                        { name: "one", text: "Uno" },
                    ],
                },
            ]),
            expectedIds: ["MANIFEST/606"],
            expectedPaths: ["BP/manifest.json"],
        },
    ];

    static async run(entry: SettingOptionsDuplicateReportsRepeatedOptionNameCase): Promise<FindingSummary> {
        return ManifestFixture.run(new SettingOptionsDuplicate(), entry);
    }
}
