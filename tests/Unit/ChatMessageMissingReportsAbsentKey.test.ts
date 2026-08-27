import assert from "node:assert/strict";
import { test } from "node:test";
import ChatMessageMissingReportsAbsentKey from "../Helpers/ChatMessageMissingReportsAbsentKey.js";

for (const entry of ChatMessageMissingReportsAbsentKey.CASES) {
    test(ChatMessageMissingReportsAbsentKey.ID + " " + entry.name, async () => {
        const result = await ChatMessageMissingReportsAbsentKey.run(entry);

        assert.deepEqual(result.ids, [...entry.expectedIds]);

        if (entry.expectedPaths !== undefined) {
            assert.deepEqual(result.paths, [...entry.expectedPaths]);
        }
    });
}
