import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { SettingNameDuplicateReportsRepeatedSettingNameCase } from "../Types/SettingNameDuplicateReportsRepeatedSettingNameTypes.js";
import SettingNameDuplicate from "../../src/Checks/Manifest/SettingNameDuplicate.js";
import ManifestFixture from "./Manifest/ManifestFixture.js";

export default abstract class SettingNameDuplicateReportsRepeatedSettingName {
    static readonly ID = "MANIFEST/605";
    static readonly CASES: readonly SettingNameDuplicateReportsRepeatedSettingNameCase[] = [
        {
            name: "test:toggle, test:slider and test:dropdown are distinct setting names",
            files: ManifestFixture.behaviorWithSettings(ManifestFixture.VALID_SETTINGS),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "toggle and slider both named test:toggle share one setting name",
            files: ManifestFixture.behaviorWithSettings([ManifestFixture.TOGGLE, { ...ManifestFixture.SLIDER, name: "test:toggle" }]),
            expectedIds: ["MANIFEST/605"],
            expectedPaths: ["BP/manifest.json"],
        },
    ];

    static async run(entry: SettingNameDuplicateReportsRepeatedSettingNameCase): Promise<FindingSummary> {
        return ManifestFixture.run(new SettingNameDuplicate(), entry);
    }
}
