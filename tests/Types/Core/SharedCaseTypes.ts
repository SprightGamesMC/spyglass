export interface FormatVersionCase {
    readonly name: string;
    readonly formatVersion: string;
    readonly expectFinding: boolean;
}

export interface DefinitionFormatVersionCase {
    readonly name: string;
    readonly path: string;
    readonly rootKey: string;
    readonly formatVersion: string;
    readonly expectFinding: boolean;
}

export interface PathContentCase {
    readonly name: string;
    readonly path: string;
    readonly content: object | string;
    readonly expectFinding: boolean;
}

export interface ContentCase {
    readonly name: string;
    readonly content: object | string;
    readonly expectFinding: boolean;
}

export interface SchemaCase {
    readonly name: string;
    readonly content: object;
    readonly expectedMessages: readonly string[];
}

export interface BlockCatalogCase {
    readonly name: string;
    readonly catalog: object;
    readonly definedBlocks: readonly string[];
    readonly expectedKeys: readonly string[];
}

export interface EntityIdentifierCase {
    readonly name: string;
    readonly description: object;
    readonly expectFinding: boolean;
}
