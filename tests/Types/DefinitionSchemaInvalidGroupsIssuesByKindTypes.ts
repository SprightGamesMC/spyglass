export interface DefinitionSchemaCase {
    readonly name: string;
    readonly path: string;
    readonly content: object;
    readonly expectedMessages: readonly string[];
}
