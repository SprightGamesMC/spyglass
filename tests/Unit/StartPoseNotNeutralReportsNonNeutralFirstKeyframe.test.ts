import assert from "node:assert/strict";
import { test } from "node:test";
import StartPoseNotNeutralReportsNonNeutralFirstKeyframe from "../Helpers/StartPoseNotNeutralReportsNonNeutralFirstKeyframe.js";
import ModelFixture from "../Helpers/Core/ModelFixture.js";

for (const entry of StartPoseNotNeutralReportsNonNeutralFirstKeyframe.CASES) {
    test(StartPoseNotNeutralReportsNonNeutralFirstKeyframe.ID + " " + entry.name, async () => {
        const findings = await StartPoseNotNeutralReportsNonNeutralFirstKeyframe.run(entry);

        assert.deepEqual(ModelFixture.ids(findings), entry.expectedIds);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(ModelFixture.paths(findings), entry.expectedPaths);
        }
    });
}
