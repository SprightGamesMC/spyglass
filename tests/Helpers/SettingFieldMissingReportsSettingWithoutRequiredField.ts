import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { SettingFieldMissingReportsSettingWithoutRequiredFieldCase } from "../Types/SettingFieldMissingReportsSettingWithoutRequiredFieldTypes.js";
import SettingFieldMissing from "../../src/Checks/Manifest/SettingFieldMissing.js";
import ManifestFixture from "./Manifest/ManifestFixture.js";

export default abstract class SettingFieldMissingReportsSettingWithoutRequiredField {
    static readonly ID = "MANIFEST/104";
    static readonly CASES: readonly SettingFieldMissingReportsSettingWithoutRequiredFieldCase[] = [
        {
            name: "label, toggle, slider and dropdown each have every required field",
            files: ManifestFixture.behaviorWithSettings(ManifestFixture.VALID_SETTINGS),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "slider without step lacks a required field",
            files: ManifestFixture.behaviorWithSettings([ManifestFixture.without(ManifestFixture.SLIDER, "step")]),
            expectedIds: ["MANIFEST/104"],
            expectedPaths: ["BP/manifest.json"],
        },
        {
            name: "toggle without default lacks a required field",
            files: ManifestFixture.behaviorWithSettings([ManifestFixture.without(ManifestFixture.TOGGLE, "default")]),
            expectedIds: ["MANIFEST/104"],
            expectedPaths: ["BP/manifest.json"],
        },
        {
            name: "dropdown without options lacks a required field",
            files: ManifestFixture.behaviorWithSettings([ManifestFixture.without(ManifestFixture.DROPDOWN, "options")]),
            expectedIds: ["MANIFEST/104"],
            expectedPaths: ["BP/manifest.json"],
        },
    ];

    static async run(entry: SettingFieldMissingReportsSettingWithoutRequiredFieldCase): Promise<FindingSummary> {
        return ManifestFixture.run(new SettingFieldMissing(), entry);
    }
}
