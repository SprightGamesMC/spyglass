import assert from "node:assert/strict";
import { test } from "node:test";
import SettingNameDuplicateReportsRepeatedSettingName from "../Helpers/SettingNameDuplicateReportsRepeatedSettingName.js";

for (const entry of SettingNameDuplicateReportsRepeatedSettingName.CASES) {
    test(SettingNameDuplicateReportsRepeatedSettingName.ID + " " + entry.name, async () => {
        const result = await SettingNameDuplicateReportsRepeatedSettingName.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedFields !== undefined) {
            assert.deepEqual(result.fields, [...entry.expectedFields]);
        }

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
