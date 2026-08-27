import assert from "node:assert/strict";
import { test } from "node:test";
import AnimationTooLongReportsOverTenSeconds from "../Helpers/AnimationTooLongReportsOverTenSeconds.js";
import ModelFixture from "../Helpers/Core/ModelFixture.js";

for (const entry of AnimationTooLongReportsOverTenSeconds.CASES) {
    test(AnimationTooLongReportsOverTenSeconds.ID + " " + entry.name, async () => {
        const findings = await AnimationTooLongReportsOverTenSeconds.run(entry);

        assert.deepEqual(ModelFixture.ids(findings), entry.expectedIds);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(ModelFixture.paths(findings), entry.expectedPaths);
        }
    });
}
