import assert from "node:assert/strict";
import { test } from "node:test";
import BoneScaleOverLimitReportsScaleOutsideRangeOrNonUniform from "../Helpers/BoneScaleOverLimitReportsScaleOutsideRangeOrNonUniform.js";
import ModelFixture from "../Helpers/Core/ModelFixture.js";

for (const entry of BoneScaleOverLimitReportsScaleOutsideRangeOrNonUniform.CASES) {
    test(BoneScaleOverLimitReportsScaleOutsideRangeOrNonUniform.ID + " " + entry.name, async () => {
        const findings = await BoneScaleOverLimitReportsScaleOutsideRangeOrNonUniform.run(entry);

        assert.deepEqual(ModelFixture.ids(findings), entry.expectedIds);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(ModelFixture.paths(findings), entry.expectedPaths);
        }
    });
}
