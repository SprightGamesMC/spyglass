import type { ImageReadFailureStatus, JsonObject } from "./LoaderTypes.js";
import type { ContentItem, Pack } from "./ModelTypes.js";

export type AtlasKind = "block" | "item";

export interface TextureImage {
    readonly item: ContentItem;
    readonly key: string;
    readonly width: number;
    readonly height: number;
    readonly bytes: number;
    readonly atlas?: AtlasKind;
    readonly subpackFolder?: string;
    readonly tier?: number;
}

export interface TextureImageFailure {
    readonly item: ContentItem;
    readonly status: ImageReadFailureStatus;
}

export interface TextureSetLayerReference {
    readonly path: string;
    readonly layer: string;
    readonly reference: string;
    readonly resolved: boolean;
}

export interface TextureSetKeys {
    readonly companionKeys: Set<string>;
    readonly merKeys: Set<string>;
    readonly layers: TextureSetLayerReference[];
}

export interface TextureCatalog {
    readonly item: ContentItem;
    readonly kind: AtlasKind;
    readonly data: JsonObject;
}

export interface TextureSubpack {
    readonly folder: string;
    readonly tier?: number;
}

export interface PackTextureMemory {
    readonly pack: Pack;
    readonly images: readonly TextureImage[];
    readonly failures: readonly TextureImageFailure[];
    readonly subpacks: readonly TextureSubpack[];
    readonly companionKeys: ReadonlySet<string>;
    readonly merKeys: ReadonlySet<string>;
    readonly layers: readonly TextureSetLayerReference[];
    readonly capabilities: readonly string[];
}

export interface TierMemory {
    readonly tier: number;
    readonly targeted: boolean;
    readonly computed: boolean;
    readonly total: number;
    readonly blockAtlas: number;
    readonly itemAtlas: number;
}

export interface AtlasTotal {
    readonly atlas: AtlasKind;
    readonly bytes: number;
}

export type TierLimitTable = "addon" | "texture" | "world";

export interface TextureCoverage {
    readonly vanillaCount: number;
    readonly missing: readonly string[];
    readonly percent?: number;
}

export interface TextureHandleSet {
    readonly packRoot: string;
    readonly handles: ReadonlySet<string>;
}
