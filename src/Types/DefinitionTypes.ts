import type { ContentItem, Pack } from "./ModelTypes.js";

export interface PackItem {
    readonly pack: Pack;
    readonly item: ContentItem;
}

export interface BlockCatalogEntry {
    readonly path: string;
    readonly pack: string;
    readonly key: string;
}

export interface BlockCatalogUsage {
    readonly unused: readonly BlockCatalogEntry[];
    readonly vanillaOverrides: readonly BlockCatalogEntry[];
}
