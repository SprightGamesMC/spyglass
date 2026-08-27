import type { LookupResult } from "../Types/VersionFetcherFallsBackWhenLookupFailsTypes.js";
import VersionFetcher from "../../src/Cli/VersionFetcher.js";
import VanillaLoader from "../../src/Loaders/VanillaLoader.js";

export default abstract class VersionFetcherFallsBackWhenLookupFails {
    static readonly REACHABLE_GAME_VERSION = "10.30.20";
    private static readonly REACHABLE_RELEASE = "10.30.20.1";
    private static readonly REACHABLE_BETA = "10.30.20-beta";
    private static readonly GAME_VERSION_FILE_NAME = "version.json";

    static sourceGameVersion(): string {
        return VanillaLoader.sourceGameVersion();
    }

    static async lookup(reachable: boolean): Promise<LookupResult> {
        const notices: string[] = [];
        const original = globalThis.fetch;

        globalThis.fetch = reachable
            ? VersionFetcherFallsBackWhenLookupFails.respondingFetch()
            : VersionFetcherFallsBackWhenLookupFails.failingFetch();

        try {
            const sources = await VersionFetcher.fetch({}, true, {
                summary: (message): void => {
                    notices.push(message);
                },
            });

            return {
                gameVersion: sources.currentGameVersion,
                betaModuleNames: Object.keys(sources.betaModuleVersions),
                notices,
            };
        } finally {
            globalThis.fetch = original;
        }
    }

    private static respondingFetch(): typeof fetch {
        return ((input: Parameters<typeof fetch>[0]): Promise<Response> => {
            const body = String(input).endsWith(VersionFetcherFallsBackWhenLookupFails.GAME_VERSION_FILE_NAME)
                ? { latest: { version: VersionFetcherFallsBackWhenLookupFails.REACHABLE_RELEASE } }
                : { "dist-tags": { beta: VersionFetcherFallsBackWhenLookupFails.REACHABLE_BETA } };

            return Promise.resolve(new Response(JSON.stringify(body)));
        }) as typeof fetch;
    }

    private static failingFetch(): typeof fetch {
        return ((): Promise<Response> => Promise.reject(new Error("The host could not be reached"))) as typeof fetch;
    }
}
