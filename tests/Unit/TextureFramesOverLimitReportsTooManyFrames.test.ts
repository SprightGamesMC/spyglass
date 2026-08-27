import assert from "node:assert/strict";
import { test } from "node:test";
import TextureFramesOverLimitReportsTooManyFrames from "../Helpers/TextureFramesOverLimitReportsTooManyFrames.js";
import ModelFixture from "../Helpers/Core/ModelFixture.js";

for (const entry of TextureFramesOverLimitReportsTooManyFrames.CASES) {
    test(TextureFramesOverLimitReportsTooManyFrames.ID + " " + entry.name, async () => {
        const findings = await TextureFramesOverLimitReportsTooManyFrames.run(entry);

        assert.deepEqual(ModelFixture.ids(findings), entry.expectedIds);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(ModelFixture.paths(findings), entry.expectedPaths);
        }
    });
}
