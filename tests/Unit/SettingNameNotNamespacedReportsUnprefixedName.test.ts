import assert from "node:assert/strict";
import { test } from "node:test";
import SettingNameNotNamespacedReportsUnprefixedName from "../Helpers/SettingNameNotNamespacedReportsUnprefixedName.js";

for (const entry of SettingNameNotNamespacedReportsUnprefixedName.CASES) {
    test(SettingNameNotNamespacedReportsUnprefixedName.ID + " " + entry.name, async () => {
        const result = await SettingNameNotNamespacedReportsUnprefixedName.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedFields !== undefined) {
            assert.deepEqual(result.fields, [...entry.expectedFields]);
        }

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
