import assert from "node:assert/strict";
import { test } from "node:test";
import VersionFetcherPicksLatestRelease from "../Helpers/VersionFetcherPicksLatestRelease.js";

for (const entry of VersionFetcherPicksLatestRelease.CASES) {
    test(entry.name, () => {
        assert.equal(VersionFetcherPicksLatestRelease.pick(entry.versions), entry.expected);
    });
}
