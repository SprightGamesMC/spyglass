import assert from "node:assert/strict";
import { test } from "node:test";
import ImageUnreadableReportsUndecodableImage from "../Helpers/ImageUnreadableReportsUndecodableImage.js";

for (const entry of ImageUnreadableReportsUndecodableImage.CASES) {
    test(ImageUnreadableReportsUndecodableImage.ID + " " + entry.name, async () => {
        const result = await ImageUnreadableReportsUndecodableImage.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
