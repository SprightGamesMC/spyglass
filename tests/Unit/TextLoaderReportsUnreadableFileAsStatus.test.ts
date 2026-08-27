import assert from "node:assert/strict";
import { test } from "node:test";
import TextLoaderReportsUnreadableFileAsStatus from "../Helpers/TextLoaderReportsUnreadableFileAsStatus.js";

for (const testCase of TextLoaderReportsUnreadableFileAsStatus.CASES) {
    test(testCase.name, async () => {
        const result = await TextLoaderReportsUnreadableFileAsStatus.read(testCase);

        assert.equal(result.status, testCase.expectedStatus);
        assert.equal(result.error === undefined, testCase.expectedStatus === "ok");
        assert.deepEqual(await TextLoaderReportsUnreadableFileAsStatus.readLines(testCase), testCase.expectedLines);
    });
}
