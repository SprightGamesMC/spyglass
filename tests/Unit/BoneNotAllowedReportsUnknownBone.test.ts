import assert from "node:assert/strict";
import { test } from "node:test";
import BoneNotAllowedReportsUnknownBone from "../Helpers/BoneNotAllowedReportsUnknownBone.js";

for (const entry of BoneNotAllowedReportsUnknownBone.CASES) {
    test(BoneNotAllowedReportsUnknownBone.ID + " " + entry.name, async () => {
        const result = await BoneNotAllowedReportsUnknownBone.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
