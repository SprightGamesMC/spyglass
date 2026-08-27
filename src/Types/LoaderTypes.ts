export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export type JsonObject = { [key: string]: JsonValue };

type JsonReadStatus = "ok" | "unreadable" | "not_utf8" | "empty" | "invalid";

export interface JsonReadResult {
    readonly status: JsonReadStatus;
    readonly value?: JsonValue;
    readonly hasByteOrderMark: boolean;
    readonly text?: string;
    readonly error?: string;
}

type TextReadStatus = "ok" | "unreadable";

export interface TextReadResult {
    readonly status: TextReadStatus;
    readonly text?: string;
    readonly error?: string;
}

type ImageFormat = "png" | "jpeg" | "gif" | "tga" | "psd";

export interface ImageMetadata {
    readonly format: ImageFormat;
    readonly width: number;
    readonly height: number;
    readonly hasAlpha: boolean;
    readonly horizontalDpi?: number;
    readonly verticalDpi?: number;
}

export interface ImageDensity {
    readonly horizontal: number;
    readonly vertical: number;
}

export interface JsonStringMatch {
    readonly value: string;
    readonly field: string;
}

export type ImageReadFailureStatus = "unreadable" | "invalid";

interface ImageReadSuccess {
    readonly status: "ok";
    readonly metadata: ImageMetadata;
}

interface ImageReadFailure {
    readonly status: ImageReadFailureStatus;
    readonly metadata?: undefined;
}

export type ImageReadResult = ImageReadSuccess | ImageReadFailure;

export interface GameVersion {
    readonly major: number;
    readonly minor: number;
    readonly patch: number;
}

interface VanillaSource {
    readonly tag: string;
    readonly date: string;
}

export interface VanillaData {
    readonly source?: VanillaSource;
    readonly files: Readonly<Record<string, string>>;
    readonly properties: Readonly<Record<string, Readonly<Record<string, string>>>>;
    readonly soundEvents?: readonly string[];
    readonly soundPaths?: readonly string[];
    readonly definitionIds?: Readonly<Record<string, readonly string[]>>;
    readonly formatVersions?: Readonly<Record<string, string>>;
}
