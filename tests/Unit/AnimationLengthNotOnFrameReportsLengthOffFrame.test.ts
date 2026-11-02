import assert from "node:assert/strict";
import { test } from "node:test";
import AnimationLengthNotOnFrameReportsLengthOffFrame from "../Helpers/AnimationLengthNotOnFrameReportsLengthOffFrame.js";
import ModelFixture from "../Helpers/Core/ModelFixture.js";

for (const entry of AnimationLengthNotOnFrameReportsLengthOffFrame.CASES) {
    test(AnimationLengthNotOnFrameReportsLengthOffFrame.ID + " " + entry.name, async () => {
        const findings = await AnimationLengthNotOnFrameReportsLengthOffFrame.run(entry);

        assert.deepEqual(ModelFixture.ids(findings), entry.expectedIds);

        if (entry.expectedFields !== undefined) {
            assert.deepEqual(ModelFixture.fields(findings), entry.expectedFields);
        }
    });
}
