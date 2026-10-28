export interface SoundDefinitionsCase {
    readonly name: string;
    readonly path?: string;
    readonly content: object | string;
    readonly expectedFields: readonly string[];
}
