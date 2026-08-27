import assert from "node:assert/strict";
import { test } from "node:test";
import BlockGeometryTooComplexReportsOverFiftyCubes from "../Helpers/BlockGeometryTooComplexReportsOverFiftyCubes.js";

for (const entry of BlockGeometryTooComplexReportsOverFiftyCubes.CASES) {
    test(BlockGeometryTooComplexReportsOverFiftyCubes.ID + " " + entry.name, async () => {
        const findings = await BlockGeometryTooComplexReportsOverFiftyCubes.run(entry);

        assert.equal(findings.length, entry.expectFinding ? 1 : 0);

        for (const finding of findings) {
            assert.equal(finding.id, BlockGeometryTooComplexReportsOverFiftyCubes.ID);
            assert.equal(finding.path, entry.path);
            assert.equal(finding.pack, "RP");
            assert.equal(finding.location?.field, "geometry.crate");
        }
    });
}
