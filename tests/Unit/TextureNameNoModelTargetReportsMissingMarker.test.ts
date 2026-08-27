import assert from "node:assert/strict";
import { test } from "node:test";
import TextureNameNoModelTargetReportsMissingMarker from "../Helpers/TextureNameNoModelTargetReportsMissingMarker.js";

for (const entry of TextureNameNoModelTargetReportsMissingMarker.CASES) {
    test(TextureNameNoModelTargetReportsMissingMarker.ID + " " + entry.name, async () => {
        const result = await TextureNameNoModelTargetReportsMissingMarker.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
