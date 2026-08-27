import assert from "node:assert/strict";
import { test } from "node:test";
import GeometryVariantMissingReportsMissingVariants from "../Helpers/GeometryVariantMissingReportsMissingVariants.js";
import ModelFixture from "../Helpers/Core/ModelFixture.js";

for (const entry of GeometryVariantMissingReportsMissingVariants.CASES) {
    test(GeometryVariantMissingReportsMissingVariants.ID + " " + entry.name, async () => {
        const findings = await GeometryVariantMissingReportsMissingVariants.run(entry);

        assert.deepEqual(ModelFixture.ids(findings), entry.expectedIds);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(ModelFixture.paths(findings), entry.expectedPaths);
        }
    });
}
