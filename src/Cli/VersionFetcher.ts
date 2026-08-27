import type { BetaModuleVersion, ReleaseCandidate, VersionSources } from "../Types/CliTypes.js";
import type { NoticeLogger } from "../Types/LoggerTypes.js";
import ToolError from "../Errors/ToolError.js";
import VanillaLoader from "../Loaders/VanillaLoader.js";
import VersionUtilities from "../Loaders/VersionUtilities.js";

export default abstract class VersionFetcher {
    private static readonly GAME_VERSION_URL = "https://raw.githubusercontent.com/Mojang/bedrock-samples/main/version.json";
    private static readonly NPM_REGISTRY_URL = "https://registry.npmjs.org/";
    private static readonly BETA_MODULES: readonly string[] = [
        "@minecraft/server",
        "@minecraft/server-ui",
        "@minecraft/server-gametest",
        "@minecraft/server-net",
        "@minecraft/server-admin",
        "@minecraft/debug-utilities",
        "@minecraft/diagnostics",
    ];
    private static readonly PREVIEW_PATCH_THRESHOLD = 20;
    private static readonly FETCH_TIMEOUT_MILLISECONDS = 10000;
    private static readonly ENVIRONMENT_GAME_VERSION = "SPYGLASS_GAME_VERSION";
    private static readonly ENVIRONMENT_SKIP_NPM = "SPYGLASS_SKIP_NPM";
    private static readonly SILENT_LOGGER: NoticeLogger = { summary: (): void => undefined };

    static async fetch(environment: NodeJS.ProcessEnv, includeBetaModules: boolean, logger?: NoticeLogger): Promise<VersionSources> {
        const notice = logger ?? VersionFetcher.SILENT_LOGGER;
        const givenGameVersion = environment[VersionFetcher.ENVIRONMENT_GAME_VERSION];
        const currentGameVersion = givenGameVersion ?? (await VersionFetcher.fetchGameVersion(notice));
        const skipNpm = environment[VersionFetcher.ENVIRONMENT_SKIP_NPM] !== undefined;
        const betaModuleVersions = includeBetaModules && !skipNpm ? await VersionFetcher.fetchBetaModuleVersions(notice) : {};

        return { currentGameVersion, betaModuleVersions };
    }

    static pickLatestRelease(body: unknown): string {
        if (typeof body !== "object" || body === null) {
            throw new ToolError("Version data has an unexpected structure");
        }

        let best: ReleaseCandidate | undefined;

        for (const entry of Object.values(body as Record<string, unknown>)) {
            const candidate = VersionFetcher.releaseCandidateOf(entry);

            if (candidate === undefined) {
                continue;
            }

            if (best === undefined || VersionUtilities.compare(candidate.version, best.version) > 0) {
                best = candidate;
            }
        }

        if (best === undefined) {
            throw new ToolError("No release version found in version data");
        }

        return best.text;
    }

    private static async fetchGameVersion(notice: NoticeLogger): Promise<string> {
        try {
            return VersionFetcher.pickLatestRelease(await VersionFetcher.fetchJson(VersionFetcher.GAME_VERSION_URL));
        } catch (error) {
            const fallback = VanillaLoader.sourceGameVersion();

            notice.summary(
                "Could not look up the current game version: " +
                    VersionFetcher.reasonOf(error) +
                    ". Using " +
                    fallback +
                    " from the vanilla data instead"
            );

            return fallback;
        }
    }

    private static releaseCandidateOf(entry: unknown): ReleaseCandidate | undefined {
        const text = typeof entry === "object" && entry !== null ? (entry as Record<string, unknown>).version : undefined;

        if (typeof text !== "string") {
            return undefined;
        }

        const parts = text.split(".").map(Number);

        if (parts.length < 3 || parts.some((part) => Number.isNaN(part)) || VersionFetcher.isPreview(parts)) {
            return undefined;
        }

        const version = VersionUtilities.parseString(text);

        if (version === undefined) {
            return undefined;
        }

        return { text: VersionUtilities.format(version), version };
    }

    private static isPreview(parts: readonly number[]): boolean {
        return (parts[3] ?? 0) >= VersionFetcher.PREVIEW_PATCH_THRESHOLD;
    }

    private static async fetchBetaModuleVersions(notice: NoticeLogger): Promise<Record<string, string>> {
        const versions: Record<string, string> = {};

        try {
            const found = await Promise.all(VersionFetcher.BETA_MODULES.map((moduleName) => VersionFetcher.fetchBetaModule(moduleName)));

            for (const entry of found) {
                if (entry !== undefined) {
                    versions[entry.moduleName] = entry.version;
                }
            }
        } catch (error) {
            notice.summary(
                "Could not look up the current beta module versions: " + VersionFetcher.reasonOf(error) + ". SCRIPT/501 reports nothing"
            );
        }

        return versions;
    }

    private static async fetchBetaModule(moduleName: string): Promise<BetaModuleVersion | undefined> {
        const body = await VersionFetcher.fetchJson(VersionFetcher.NPM_REGISTRY_URL + moduleName);
        const tags = typeof body === "object" && body !== null ? (body as Record<string, unknown>)["dist-tags"] : undefined;
        const beta = typeof tags === "object" && tags !== null ? (tags as Record<string, unknown>).beta : undefined;

        if (typeof beta !== "string" || VersionUtilities.parseString(beta) === undefined) {
            return undefined;
        }

        return { moduleName, version: beta };
    }

    private static reasonOf(error: unknown): string {
        return error instanceof Error ? error.message : String(error);
    }

    private static async fetchJson(url: string): Promise<unknown> {
        let response: Response;

        try {
            response = await fetch(url, { signal: AbortSignal.timeout(VersionFetcher.FETCH_TIMEOUT_MILLISECONDS) });
        } catch (error) {
            throw new ToolError("Could not fetch " + url, error);
        }

        if (!response.ok) {
            throw new ToolError("Could not fetch " + url + ": HTTP " + response.status);
        }

        try {
            return await response.json();
        } catch (error) {
            throw new ToolError("Response from " + url + " is not JSON", error);
        }
    }
}
