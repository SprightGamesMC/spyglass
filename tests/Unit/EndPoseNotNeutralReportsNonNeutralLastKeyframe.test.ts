import assert from "node:assert/strict";
import { test } from "node:test";
import EndPoseNotNeutralReportsNonNeutralLastKeyframe from "../Helpers/EndPoseNotNeutralReportsNonNeutralLastKeyframe.js";
import ModelFixture from "../Helpers/Core/ModelFixture.js";

for (const entry of EndPoseNotNeutralReportsNonNeutralLastKeyframe.CASES) {
    test(EndPoseNotNeutralReportsNonNeutralLastKeyframe.ID + " " + entry.name, async () => {
        const findings = await EndPoseNotNeutralReportsNonNeutralLastKeyframe.run(entry);

        assert.deepEqual(ModelFixture.ids(findings), entry.expectedIds);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(ModelFixture.paths(findings), entry.expectedPaths);
        }
    });
}
