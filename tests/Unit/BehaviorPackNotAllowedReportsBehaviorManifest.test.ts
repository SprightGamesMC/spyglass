import assert from "node:assert/strict";
import { test } from "node:test";
import BehaviorPackNotAllowedReportsBehaviorManifest from "../Helpers/BehaviorPackNotAllowedReportsBehaviorManifest.js";

for (const entry of BehaviorPackNotAllowedReportsBehaviorManifest.CASES) {
    test(BehaviorPackNotAllowedReportsBehaviorManifest.ID + " " + entry.name, async () => {
        const result = await BehaviorPackNotAllowedReportsBehaviorManifest.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
