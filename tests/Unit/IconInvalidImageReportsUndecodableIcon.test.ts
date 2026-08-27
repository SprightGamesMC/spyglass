import assert from "node:assert/strict";
import { test } from "node:test";
import IconInvalidImageReportsUndecodableIcon from "../Helpers/IconInvalidImageReportsUndecodableIcon.js";

for (const entry of IconInvalidImageReportsUndecodableIcon.CASES) {
    test(IconInvalidImageReportsUndecodableIcon.ID + " " + entry.name, async () => {
        const result = await IconInvalidImageReportsUndecodableIcon.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);
        assert.deepEqual(result.paths, [...entry.expectedPaths]);
    });
}
