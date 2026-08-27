import assert from "node:assert/strict";
import { test } from "node:test";
import AnimatedTextureInvalidReportsBadFrameSizeOrCount from "../Helpers/AnimatedTextureInvalidReportsBadFrameSizeOrCount.js";
import ModelFixture from "../Helpers/Core/ModelFixture.js";

for (const entry of AnimatedTextureInvalidReportsBadFrameSizeOrCount.CASES) {
    test(AnimatedTextureInvalidReportsBadFrameSizeOrCount.ID + " " + entry.name, async () => {
        const findings = await AnimatedTextureInvalidReportsBadFrameSizeOrCount.run(entry);

        assert.deepEqual(ModelFixture.ids(findings), entry.expectedIds);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(ModelFixture.paths(findings), entry.expectedPaths);
        }
    });
}
