import type { ContentType } from "../../../src/Types/CheckTypes.js";
import type { FixtureFiles } from "./FixtureTypes.js";

export interface PersonaPieceOptions {
    readonly metaName?: string;
    readonly meta?: object;
    readonly metaOverrides?: Record<string, unknown>;
    readonly geometry?: object | null;
    readonly textures?: Record<string, Uint8Array>;
    readonly lang?: string | null;
    readonly manifest?: object;
    readonly extra?: FixtureFiles;
}

export interface EmoteOptions {
    readonly metaName?: string;
    readonly meta?: object;
    readonly metaOverrides?: Record<string, unknown>;
    readonly animation?: object | null;
    readonly lang?: string | null;
    readonly manifest?: object;
    readonly extra?: FixtureFiles;
}

export interface EmoteAnimationOptions {
    readonly name?: string;
    readonly formatVersion?: string | number;
    readonly length?: number;
    readonly loop?: boolean | string;
    readonly bones?: Record<string, unknown>;
    readonly extraAnimations?: Record<string, unknown>;
}

export interface PersonaCase {
    readonly name: string;
    readonly files: FixtureFiles;
    readonly expectedIds: readonly string[];
    readonly expectedPaths?: readonly string[];
    readonly contentType?: ContentType;
}
