import assert from "node:assert/strict";
import { test } from "node:test";
import HoldOnLastFrameUsedReportsHoldLoop from "../Helpers/HoldOnLastFrameUsedReportsHoldLoop.js";
import ModelFixture from "../Helpers/Core/ModelFixture.js";

for (const entry of HoldOnLastFrameUsedReportsHoldLoop.CASES) {
    test(HoldOnLastFrameUsedReportsHoldLoop.ID + " " + entry.name, async () => {
        const findings = await HoldOnLastFrameUsedReportsHoldLoop.run(entry);

        assert.deepEqual(ModelFixture.ids(findings), entry.expectedIds);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(ModelFixture.paths(findings), entry.expectedPaths);
        }
    });
}
