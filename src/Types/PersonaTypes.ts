import type { ImageMetadata, JsonObject } from "./LoaderTypes.js";
import type { ContentItem, Pack } from "./ModelTypes.js";

export interface PersonaPieceIdentity {
    readonly pieceName?: string;
    readonly pieceType?: string;
}

export interface PersonaGeometryDefinition {
    readonly path: string;
    readonly identifier: string;
}

export interface PersonaPackData {
    readonly pack: Pack;
    readonly metaPaths: readonly string[];
    readonly metaPath?: string;
    readonly meta?: JsonObject;
    readonly geometryPaths: readonly string[];
    readonly geometry: readonly PersonaGeometryDefinition[];
    readonly isEmote: boolean;
}

export interface PersonaSourceEntry {
    readonly entry: JsonObject;
    readonly field: string;
}

export interface PersonaTextureReference {
    readonly name: string;
    readonly field: string;
}

export interface PersonaImageSource {
    readonly name: string;
    readonly item: ContentItem;
    readonly field: string;
    readonly metadata: ImageMetadata;
}

export interface PersonaLangFile {
    readonly path: string;
    readonly entries: ReadonlyMap<string, string>;
}

export interface GeometryIdentifierParts {
    readonly name: string;
    readonly bodySize: string;
    readonly armSize?: string;
    readonly side?: string;
    readonly zone?: string;
}

export interface GeometryVariant {
    readonly bodySize: string;
    readonly armSize?: string;
    readonly side?: string;
}

export interface EmoteAnimationFile {
    readonly path: string;
    readonly root: JsonObject;
    readonly animations: ReadonlyMap<string, JsonObject>;
}

export type PersonaSourcePredicate = (entry: JsonObject) => boolean;

export interface PersonaZoneField {
    readonly zones: readonly string[];
    readonly field: string;
}

export type EmoteChannel = "rotation" | "position" | "scale";

export type EmoteEdge = "start" | "end";

export interface EmoteKeyframe {
    readonly time: number;
    readonly pre?: readonly number[];
    readonly post?: readonly number[];
}
