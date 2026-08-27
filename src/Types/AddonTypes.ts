import type { PackItem } from "./DefinitionTypes.js";
import type { JsonObject } from "./LoaderTypes.js";
import type { ContentItem, Pack } from "./ModelTypes.js";

export interface FolderChildren {
    readonly files: readonly ContentItem[];
    readonly folders: readonly string[];
}

export interface CreatorFolder {
    readonly typeFolder: string;
    readonly creatorFolder: string;
}

export interface PackManifest {
    readonly pack: Pack;
    readonly manifest: JsonObject;
}

export interface IdentifierPrefix {
    readonly prefix: readonly string[];
    readonly label: string;
}

export interface CollectedIdentifier {
    readonly item: PackItem;
    readonly identifier: string;
    readonly field: string;
    readonly prefix: IdentifierPrefix;
}

export interface FoundIdentifier {
    readonly identifier: string;
    readonly field: string;
}

export interface CatalogKey {
    readonly key: string;
    readonly field: string;
}

export interface KeyedIdentifierSource {
    readonly key: string;
    readonly prefix: IdentifierPrefix;
}
