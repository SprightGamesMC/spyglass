import assert from "node:assert/strict";
import { test } from "node:test";
import LoopEnabledReportsLoopTrue from "../Helpers/LoopEnabledReportsLoopTrue.js";
import ModelFixture from "../Helpers/Core/ModelFixture.js";

for (const entry of LoopEnabledReportsLoopTrue.CASES) {
    test(LoopEnabledReportsLoopTrue.ID + " " + entry.name, async () => {
        const findings = await LoopEnabledReportsLoopTrue.run(entry);

        assert.deepEqual(ModelFixture.ids(findings), entry.expectedIds);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(ModelFixture.paths(findings), entry.expectedPaths);
        }
    });
}
