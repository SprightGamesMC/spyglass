import assert from "node:assert/strict";
import { test } from "node:test";
import DimensionMappingUnclaimedReportsTableEntryWithoutChunks from "../Helpers/DimensionMappingUnclaimedReportsTableEntryWithoutChunks.js";
import ModelFixture from "../Helpers/Core/ModelFixture.js";
import DimensionWorld from "../Helpers/World/DimensionWorld.js";

for (const entry of DimensionMappingUnclaimedReportsTableEntryWithoutChunks.CASES) {
    test(DimensionMappingUnclaimedReportsTableEntryWithoutChunks.ID + " " + entry.name, async () => {
        const findings = await DimensionMappingUnclaimedReportsTableEntryWithoutChunks.run(entry);

        assert.deepEqual(ModelFixture.sortedIds(findings), [...entry.expectedIds].sort());

        for (const finding of findings) {
            assert.equal(finding.path, DimensionWorld.ROOT);
        }
    });
}
