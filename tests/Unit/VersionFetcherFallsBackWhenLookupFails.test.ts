import assert from "node:assert/strict";
import { test } from "node:test";
import VersionFetcherFallsBackWhenLookupFails from "../Helpers/VersionFetcherFallsBackWhenLookupFails.js";

test("a reachable version file gives the fetched game version and no notice", async () => {
    const result = await VersionFetcherFallsBackWhenLookupFails.lookup(true);

    assert.equal(result.gameVersion, VersionFetcherFallsBackWhenLookupFails.REACHABLE_GAME_VERSION);
    assert.deepEqual(result.notices, []);
});

test("a reachable registry gives a beta version for every listed module", async () => {
    const result = await VersionFetcherFallsBackWhenLookupFails.lookup(true);

    assert.ok(result.betaModuleNames.length > 0);
});

test("an unreachable version file gives the game version of the vanilla data and a notice", async () => {
    const result = await VersionFetcherFallsBackWhenLookupFails.lookup(false);

    assert.equal(result.gameVersion, VersionFetcherFallsBackWhenLookupFails.sourceGameVersion());
    assert.ok(result.notices.some((notice) => notice.includes("current game version")));
});

test("an unreachable registry gives no beta versions and a notice", async () => {
    const result = await VersionFetcherFallsBackWhenLookupFails.lookup(false);

    assert.deepEqual(result.betaModuleNames, []);
    assert.ok(result.notices.some((notice) => notice.includes("beta module versions")));
});
