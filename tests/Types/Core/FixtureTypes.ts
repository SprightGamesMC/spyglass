import type { CheckContext, ContentType, Finding, Layout } from "../../../src/Types/CheckTypes.js";
import type { VanillaData } from "../../../src/Types/LoaderTypes.js";

export type FixtureFiles = Readonly<Record<string, Uint8Array | string | object>>;

export interface FixtureOptions {
    readonly contentType?: ContentType;
    readonly layout?: Layout;
    readonly currentGameVersion?: string;
    readonly betaModuleVersions?: Readonly<Record<string, string>>;
    readonly vanilla?: VanillaData;
    readonly unreadable?: readonly string[];
}

export interface FindingSummary {
    readonly ids: string[];
    readonly fields: string[];
    readonly paths: string[];
}

export interface RunResult {
    readonly context: CheckContext;
    readonly findings: readonly Finding[];
}

export interface PngOptions {
    readonly width: number;
    readonly height: number;
    readonly alpha?: boolean;
    readonly dpi?: number;
}

export interface JpegOptions {
    readonly width: number;
    readonly height: number;
    readonly dpi?: number;
}

export interface GifOptions {
    readonly width: number;
    readonly height: number;
}

export interface TgaOptions {
    readonly width: number;
    readonly height: number;
    readonly alpha?: boolean;
}

export interface PsdOptions {
    readonly width: number;
    readonly height: number;
    readonly dpi?: number;
}
