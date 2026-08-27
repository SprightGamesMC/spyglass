import assert from "node:assert/strict";
import { test } from "node:test";
import ZipStorageReadsArchiveEntries from "../Helpers/ZipStorageReadsArchiveEntries.js";

for (const fixture of ZipStorageReadsArchiveEntries.FIXTURES) {
    test((fixture.deflate ? "deflated" : "stored") + " archive lists every entry path and reads each entry back unchanged", async () => {
        const storage = ZipStorageReadsArchiveEntries.open(fixture);
        const paths = storage
            .listFiles()
            .map((entry) => entry.path)
            .sort();

        assert.deepEqual(paths, Object.keys(fixture.files).sort());

        for (const [path, content] of Object.entries(fixture.files)) {
            assert.equal(await ZipStorageReadsArchiveEntries.readText(storage, path), content);
        }
    });
}

test("bytes that are not a zip archive throw on open", () => {
    assert.equal(ZipStorageReadsArchiveEntries.openInvalid(), undefined);
});
