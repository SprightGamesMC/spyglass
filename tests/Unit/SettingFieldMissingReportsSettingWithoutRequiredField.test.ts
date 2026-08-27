import assert from "node:assert/strict";
import { test } from "node:test";
import SettingFieldMissingReportsSettingWithoutRequiredField from "../Helpers/SettingFieldMissingReportsSettingWithoutRequiredField.js";

for (const entry of SettingFieldMissingReportsSettingWithoutRequiredField.CASES) {
    test(SettingFieldMissingReportsSettingWithoutRequiredField.ID + " " + entry.name, async () => {
        const result = await SettingFieldMissingReportsSettingWithoutRequiredField.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedFields !== undefined) {
            assert.deepEqual(result.fields, [...entry.expectedFields]);
        }

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
