export interface LinkNotFoundReportsUndefinedReferenceCase {
    readonly name: string;
    readonly geometry: string;
    readonly texture: string;
    readonly textureInSubpack?: boolean;
    readonly textureSetColor: string;
    readonly particleTexture?: string;
    readonly entity: string;
    readonly controllerAlias: string;
    readonly sound: string;
    readonly expectedMessages: readonly string[];
}
