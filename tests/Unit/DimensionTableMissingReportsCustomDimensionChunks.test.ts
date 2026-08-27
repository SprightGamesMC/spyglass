import assert from "node:assert/strict";
import { test } from "node:test";
import DimensionTableMissingReportsCustomDimensionChunks from "../Helpers/DimensionTableMissingReportsCustomDimensionChunks.js";
import ModelFixture from "../Helpers/Core/ModelFixture.js";
import DimensionWorld from "../Helpers/World/DimensionWorld.js";

for (const entry of DimensionTableMissingReportsCustomDimensionChunks.CASES) {
    test(DimensionTableMissingReportsCustomDimensionChunks.ID + " " + entry.name, async () => {
        const findings = await DimensionTableMissingReportsCustomDimensionChunks.run(entry);

        assert.deepEqual(ModelFixture.sortedIds(findings), [...entry.expectedIds].sort());

        for (const finding of findings) {
            assert.equal(finding.path, DimensionWorld.ROOT);
        }
    });
}
