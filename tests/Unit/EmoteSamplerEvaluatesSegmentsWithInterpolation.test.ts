import assert from "node:assert/strict";
import { test } from "node:test";
import EmoteSamplerEvaluatesSegmentsWithInterpolation from "../Helpers/EmoteSamplerEvaluatesSegmentsWithInterpolation.js";

for (const entry of EmoteSamplerEvaluatesSegmentsWithInterpolation.CASES) {
    test(entry.name, () => {
        const value = EmoteSamplerEvaluatesSegmentsWithInterpolation.sampleY(entry);

        assert.ok(value !== undefined && Math.abs(value - entry.expectedY) < 0.000001, "sampled Y is " + value);
    });
}

test("keyframes off a frame are sampled together with every multiple of 1/24 second between them", () => {
    assert.deepEqual(EmoteSamplerEvaluatesSegmentsWithInterpolation.times(), [0.01, 1 / 24, 2 / 24, 0.1]);
});
