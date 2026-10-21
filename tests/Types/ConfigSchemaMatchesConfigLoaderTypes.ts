export interface SchemaProperty {
    readonly enum?: readonly string[];
    readonly propertyNames?: { readonly pattern: string };
    readonly additionalProperties?: { readonly enum: readonly string[] };
}

export interface ConfigSchema {
    readonly definitions: { readonly selector: { readonly pattern: string } };
    readonly properties: Readonly<Record<string, SchemaProperty>>;
}

export interface EnumCase {
    readonly key: string;
    readonly allowed: readonly string[];
}
