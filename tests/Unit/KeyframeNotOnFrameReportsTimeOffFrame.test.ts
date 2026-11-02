import assert from "node:assert/strict";
import { test } from "node:test";
import KeyframeNotOnFrameReportsTimeOffFrame from "../Helpers/KeyframeNotOnFrameReportsTimeOffFrame.js";
import ModelFixture from "../Helpers/Core/ModelFixture.js";

for (const entry of KeyframeNotOnFrameReportsTimeOffFrame.CASES) {
    test(KeyframeNotOnFrameReportsTimeOffFrame.ID + " " + entry.name, async () => {
        const findings = await KeyframeNotOnFrameReportsTimeOffFrame.run(entry);

        assert.deepEqual(ModelFixture.ids(findings), entry.expectedIds);

        if (entry.expectedFields !== undefined) {
            assert.deepEqual(ModelFixture.fields(findings), entry.expectedFields);
        }
    });
}
