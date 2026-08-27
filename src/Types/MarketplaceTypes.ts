import type { GameVersion } from "./LoaderTypes.js";
import type { Pack } from "./ModelTypes.js";

export interface PackReferenceFile {
    readonly pack: Pack;
    readonly expectedPath: string;
    readonly path?: string;
}

export type PackVersionField = "header.version" | "header.min_engine_version";

export interface PackVersion {
    readonly pack: Pack;
    readonly field: PackVersionField;
    readonly version: GameVersion;
}

export interface PackVersionDifference {
    readonly pack: Pack;
    readonly message: string;
}
