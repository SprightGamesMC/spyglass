import assert from "node:assert/strict";
import { test } from "node:test";
import SubpacksNotApplicableReportsNonResourcePack from "../Helpers/SubpacksNotApplicableReportsNonResourcePack.js";

for (const entry of SubpacksNotApplicableReportsNonResourcePack.CASES) {
    test(SubpacksNotApplicableReportsNonResourcePack.ID + " " + entry.name, async () => {
        const result = await SubpacksNotApplicableReportsNonResourcePack.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedFields !== undefined) {
            assert.deepEqual(result.fields, [...entry.expectedFields]);
        }

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
