import type { VersionSources } from "../Types/CliTypes.js";
import type { GameVersion } from "../Types/LoaderTypes.js";
import type { ProgressLogger } from "../Types/LoggerTypes.js";
import type { Storage } from "../Types/StorageTypes.js";
import ToolError from "../Errors/ToolError.js";
import ImageLoader from "./ImageLoader.js";
import JsonLoader from "./JsonLoader.js";
import PromiseCache from "./PromiseCache.js";
import TextLoader from "./TextLoader.js";
import VanillaLoader from "./VanillaLoader.js";
import VersionUtilities from "./VersionUtilities.js";

export default class Loaders {
    private static readonly SILENT_LOGGER: ProgressLogger = { debug: (): void => undefined };

    readonly json: JsonLoader;
    readonly text: TextLoader;
    readonly image: ImageLoader;
    readonly vanilla: VanillaLoader;
    readonly currentGameVersion: GameVersion;
    readonly betaModuleVersions: Readonly<Record<string, string>>;

    private readonly shared = new PromiseCache<unknown>();
    private readonly logger: ProgressLogger;

    constructor(storage: Storage, versions: VersionSources, vanilla?: VanillaLoader, logger?: ProgressLogger) {
        const current = VersionUtilities.parseString(versions.currentGameVersion);

        if (current === undefined) {
            throw new ToolError("Current game version is not a version string: " + versions.currentGameVersion);
        }

        this.json = new JsonLoader(storage);
        this.text = new TextLoader(storage);
        this.image = new ImageLoader(storage);
        this.vanilla = vanilla ?? new VanillaLoader();
        this.currentGameVersion = current;
        this.betaModuleVersions = versions.betaModuleVersions;
        this.logger = logger ?? Loaders.SILENT_LOGGER;
    }

    cached<T>(key: string, compute: () => Promise<T>): Promise<T> {
        return this.shared.get(key, () => {
            this.logger.debug("Computing shared data " + key);

            return compute();
        }) as Promise<T>;
    }
}
