import type { JsonValue } from "../Types/LoaderTypes.js";
import type { Schema, SchemaIssue, SchemaType } from "../Types/SchemaTypes.js";
import JsonKeys from "../Data/JsonKeys.js";
import JsonLoader from "./JsonLoader.js";

export default abstract class SchemaValidator {
    static validate(value: JsonValue | undefined, schema: Schema, path = ""): SchemaIssue[] {
        const issues: SchemaIssue[] = [];

        SchemaValidator.visit(value, schema, path, issues);

        return issues;
    }

    static groupByKind(issues: readonly SchemaIssue[]): Map<SchemaIssue["kind"], SchemaIssue[]> {
        const groups = new Map<SchemaIssue["kind"], SchemaIssue[]>();

        for (const issue of issues) {
            const existing = groups.get(issue.kind) ?? [];

            existing.push(issue);
            groups.set(issue.kind, existing);
        }

        return groups;
    }

    private static visit(value: JsonValue | undefined, schema: Schema, path: string, issues: SchemaIssue[]): void {
        if (schema.definitionTypes !== undefined) {
            SchemaValidator.visitDefinitionTypes(value, schema.definitionTypes, path, issues);

            return;
        }

        if (schema.anyOf !== undefined) {
            SchemaValidator.visitAnyOf(value, schema, path, issues);

            return;
        }

        if (schema.type !== undefined && !SchemaValidator.matchesType(value, schema.type)) {
            issues.push({
                kind: "wrong_type",
                path,
                message: SchemaValidator.describe(path) + " should be " + SchemaValidator.typeList(schema.type),
            });

            return;
        }

        if (schema.enum !== undefined && !schema.enum.some((allowed) => allowed === value)) {
            issues.push({
                kind: "not_in_enum",
                path,
                message: SchemaValidator.describe(path) + " should be one of " + schema.enum.map(String).join(", "),
            });

            return;
        }

        SchemaValidator.visitNumber(value, schema, path, issues);
        SchemaValidator.visitString(value, schema, path, issues);
        SchemaValidator.visitArray(value, schema, path, issues);
        SchemaValidator.visitObject(value, schema, path, issues);
    }

    private static visitDefinitionTypes(
        value: JsonValue | undefined,
        definitionTypes: Readonly<Record<string, Schema>>,
        path: string,
        issues: SchemaIssue[]
    ): void {
        if (!JsonLoader.isObject(value)) {
            issues.push({ kind: "wrong_type", path, message: SchemaValidator.describe(path) + " should be object" });

            return;
        }

        const rootKey = Object.keys(value).find((key) => definitionTypes[key] !== undefined);

        if (rootKey !== undefined) {
            SchemaValidator.visit(value, definitionTypes[rootKey], path, issues);

            return;
        }

        const candidate = Object.keys(value).find((key) => key !== JsonKeys.FORMAT_VERSION);
        const issuePath = candidate === undefined ? path : SchemaValidator.child(path, candidate);

        issues.push({
            kind: "unknown_type",
            path: issuePath,
            message: SchemaValidator.describe(issuePath) + " is not a known definition type",
        });
    }

    private static visitAnyOf(value: JsonValue | undefined, schema: Schema, path: string, issues: SchemaIssue[]): void {
        const attempts = (schema.anyOf ?? []).map((option) => SchemaValidator.validate(value, option, path));

        if (attempts.some((attempt) => attempt.length === 0)) {
            return;
        }

        const best = attempts.reduce((chosen, attempt) => (attempt.length < chosen.length ? attempt : chosen));

        issues.push(...best);
    }

    private static visitNumber(value: JsonValue | undefined, schema: Schema, path: string, issues: SchemaIssue[]): void {
        if (typeof value !== "number") {
            return;
        }

        if (schema.minimum !== undefined && value < schema.minimum) {
            issues.push({ kind: "structure", path, message: SchemaValidator.describe(path) + " should be at least " + schema.minimum });
        }

        if (schema.maximum !== undefined && value > schema.maximum) {
            issues.push({ kind: "structure", path, message: SchemaValidator.describe(path) + " should be at most " + schema.maximum });
        }
    }

    private static visitString(value: JsonValue | undefined, schema: Schema, path: string, issues: SchemaIssue[]): void {
        if (typeof value !== "string" || schema.pattern === undefined) {
            return;
        }

        if (!new RegExp(schema.pattern).test(value)) {
            issues.push({ kind: "structure", path, message: SchemaValidator.describe(path) + " should match " + schema.pattern });
        }
    }

    private static visitArray(value: JsonValue | undefined, schema: Schema, path: string, issues: SchemaIssue[]): void {
        if (!Array.isArray(value)) {
            return;
        }

        if (schema.minItems !== undefined && value.length < schema.minItems) {
            issues.push({
                kind: "structure",
                path,
                message: SchemaValidator.describe(path) + " should have at least " + schema.minItems + " items",
            });
        }

        if (schema.maxItems !== undefined && value.length > schema.maxItems) {
            issues.push({
                kind: "structure",
                path,
                message: SchemaValidator.describe(path) + " should have at most " + schema.maxItems + " items",
            });
        }

        if (schema.items === undefined) {
            return;
        }

        value.forEach((entry, index) => SchemaValidator.visit(entry, schema.items as Schema, path + "[" + index + "]", issues));
    }

    private static visitObject(value: JsonValue | undefined, schema: Schema, path: string, issues: SchemaIssue[]): void {
        if (!JsonLoader.isObject(value)) {
            return;
        }

        for (const key of schema.required ?? []) {
            if (value[key] === undefined) {
                issues.push({
                    kind: "missing_required",
                    path: SchemaValidator.child(path, key),
                    message: SchemaValidator.describe(SchemaValidator.child(path, key)) + " is required",
                });
            }
        }

        for (const [key, entry] of Object.entries(value)) {
            const property = schema.properties?.[key];

            if (property !== undefined) {
                SchemaValidator.visit(entry, property, SchemaValidator.child(path, key), issues);
                continue;
            }

            if (schema.additionalProperties === false) {
                issues.push({
                    kind: "structure",
                    path: SchemaValidator.child(path, key),
                    message: SchemaValidator.describe(SchemaValidator.child(path, key)) + " is not a known property",
                });
                continue;
            }

            if (typeof schema.additionalProperties === "object") {
                SchemaValidator.visit(entry, schema.additionalProperties, SchemaValidator.child(path, key), issues);
            }
        }
    }

    private static matchesType(value: JsonValue | undefined, type: SchemaType | readonly SchemaType[]): boolean {
        const types = Array.isArray(type) ? type : [type as SchemaType];

        return types.some((candidate) => SchemaValidator.matchesOne(value, candidate));
    }

    private static matchesOne(value: JsonValue | undefined, type: SchemaType): boolean {
        switch (type) {
            case "object":
                return JsonLoader.isObject(value);
            case "array":
                return Array.isArray(value);
            case "string":
                return typeof value === "string";
            case "number":
                return typeof value === "number";
            case "integer":
                return typeof value === "number" && Number.isInteger(value);
            case "boolean":
                return typeof value === "boolean";
            case "null":
                return value === null;
        }
    }

    private static typeList(type: SchemaType | readonly SchemaType[]): string {
        return Array.isArray(type) ? type.join(" or ") : String(type);
    }

    private static child(path: string, key: string): string {
        return path === "" ? key : path + "." + key;
    }

    private static describe(path: string): string {
        return path === "" ? "root" : path;
    }
}
