import type { PromiseCacheOutcome } from "../Types/PromiseCacheReturnsOnePromisePerKeyTypes.js";
import PromiseCache from "../../src/Loaders/PromiseCache.js";

export default abstract class PromiseCacheReturnsOnePromisePerKey {
    static async run(keys: readonly [string, string]): Promise<PromiseCacheOutcome> {
        const cache = new PromiseCache<string>();
        let loadCount = 0;
        const load = (key: string): Promise<string> => {
            loadCount += 1;

            return Promise.resolve(key.toUpperCase());
        };
        const first = cache.get(keys[0], () => load(keys[0]));
        const second = cache.get(keys[1], () => load(keys[1]));

        await Promise.all([first, second]);

        return { loadCount, samePromise: first === second };
    }
}
