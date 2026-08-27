export type SchemaType = "object" | "array" | "string" | "number" | "integer" | "boolean" | "null";

export interface Schema {
    readonly type?: SchemaType | readonly SchemaType[];
    readonly properties?: Readonly<Record<string, Schema>>;
    readonly required?: readonly string[];
    readonly additionalProperties?: boolean | Schema;
    readonly items?: Schema;
    readonly enum?: readonly (string | number | boolean | null)[];
    readonly minItems?: number;
    readonly maxItems?: number;
    readonly minimum?: number;
    readonly maximum?: number;
    readonly pattern?: string;
    readonly anyOf?: readonly Schema[];
    readonly definitionTypes?: Readonly<Record<string, Schema>>;
}

export type SchemaIssueKind = "missing_required" | "wrong_type" | "not_in_enum" | "unknown_type" | "structure";

export interface SchemaIssue {
    readonly kind: SchemaIssueKind;
    readonly path: string;
    readonly message: string;
}
