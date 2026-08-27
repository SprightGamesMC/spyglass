import assert from "node:assert/strict";
import { test } from "node:test";
import GeometryNotAllowedReportsNonHumanoidGeometry from "../Helpers/GeometryNotAllowedReportsNonHumanoidGeometry.js";

for (const entry of GeometryNotAllowedReportsNonHumanoidGeometry.CASES) {
    test(GeometryNotAllowedReportsNonHumanoidGeometry.ID + " " + entry.name, async () => {
        const result = await GeometryNotAllowedReportsNonHumanoidGeometry.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
