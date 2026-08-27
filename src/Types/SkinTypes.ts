import type { Pack } from "./ModelTypes.js";

export type SkinTextureRole = "skin" | "cape";

export interface SkinEntry {
    readonly index: number;
    readonly field: string;
    readonly localizationName?: string;
    readonly geometry?: string;
    readonly texture?: string;
    readonly type?: string;
    readonly cape?: string;
}

export interface SkinPackDefinition {
    readonly pack: Pack;
    readonly path: string;
    readonly serializeName?: string;
    readonly localizationName?: string;
    readonly skins: readonly SkinEntry[];
}
