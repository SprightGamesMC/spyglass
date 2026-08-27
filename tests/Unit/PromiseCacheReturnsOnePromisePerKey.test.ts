import assert from "node:assert/strict";
import { test } from "node:test";
import PromiseCacheReturnsOnePromisePerKey from "../Helpers/PromiseCacheReturnsOnePromisePerKey.js";

test("the same key twice loads once and returns the same promise", async () => {
    const outcome = await PromiseCacheReturnsOnePromisePerKey.run(["a", "a"]);

    assert.equal(outcome.loadCount, 1);
    assert.equal(outcome.samePromise, true);
});

test("two different keys load twice and return different promises", async () => {
    const outcome = await PromiseCacheReturnsOnePromisePerKey.run(["a", "b"]);

    assert.equal(outcome.loadCount, 2);
    assert.equal(outcome.samePromise, false);
});
