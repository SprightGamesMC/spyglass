export interface SoundDefinitionsCase {
    readonly name: string;
    readonly content: object | string;
    readonly expectedFields: readonly string[];
}
