import assert from "node:assert/strict";
import { test } from "node:test";
import UnknownCommandReportsCommandBlockWithUnknownCommand from "../Helpers/UnknownCommandReportsCommandBlockWithUnknownCommand.js";
import ModelFixture from "../Helpers/Core/ModelFixture.js";
import DimensionWorld from "../Helpers/World/DimensionWorld.js";

for (const entry of UnknownCommandReportsCommandBlockWithUnknownCommand.CASES) {
    test(UnknownCommandReportsCommandBlockWithUnknownCommand.ID + " " + entry.name, async () => {
        const findings = await UnknownCommandReportsCommandBlockWithUnknownCommand.run(entry);

        assert.deepEqual(ModelFixture.sortedIds(findings), [...entry.expectedIds].sort());

        for (const finding of findings) {
            assert.equal(finding.path, DimensionWorld.ROOT);
        }
    });
}
