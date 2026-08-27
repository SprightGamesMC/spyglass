import assert from "node:assert/strict";
import { test } from "node:test";
import CommandFromOlderVersionReportsCommandVersionBelowModern from "../Helpers/CommandFromOlderVersionReportsCommandVersionBelowModern.js";
import ModelFixture from "../Helpers/Core/ModelFixture.js";
import DimensionWorld from "../Helpers/World/DimensionWorld.js";

for (const entry of CommandFromOlderVersionReportsCommandVersionBelowModern.CASES) {
    test(CommandFromOlderVersionReportsCommandVersionBelowModern.ID + " " + entry.name, async () => {
        const findings = await CommandFromOlderVersionReportsCommandVersionBelowModern.run(entry);

        assert.deepEqual(ModelFixture.sortedIds(findings), [...entry.expectedIds].sort());

        for (const finding of findings) {
            assert.equal(finding.path, DimensionWorld.ROOT);
        }
    });
}
