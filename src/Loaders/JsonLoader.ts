import type { JsonObject, JsonReadResult, JsonStringMatch, JsonValue } from "../Types/LoaderTypes.js";
import type { Storage } from "../Types/StorageTypes.js";
import ToolError from "../Errors/ToolError.js";
import JsoncParser from "./JsoncParser.js";
import PromiseCache from "./PromiseCache.js";

export default class JsonLoader {
    static readonly BYTE_ORDER_MARK = "\uFEFF";
    private static readonly MINIMUM_CONTENT_LENGTH = 2;

    private readonly storage: Storage;
    private readonly cache = new PromiseCache<JsonReadResult>();

    static isObject(value: JsonValue | undefined): value is JsonObject {
        return typeof value === "object" && value !== null && !Array.isArray(value);
    }

    static isArray(value: JsonValue | undefined): value is JsonValue[] {
        return Array.isArray(value);
    }

    static get(value: JsonValue | undefined, ...keys: string[]): JsonValue | undefined {
        let current = value;

        for (const key of keys) {
            if (!JsonLoader.isObject(current)) {
                return undefined;
            }

            current = current[key];
        }

        return current;
    }

    static collectStrings(value: JsonValue | undefined, predicate: (text: string) => boolean, field = ""): JsonStringMatch[] {
        if (typeof value === "string") {
            return predicate(value) ? [{ value, field }] : [];
        }

        if (JsonLoader.isArray(value)) {
            return value.flatMap((entry) => JsonLoader.collectStrings(entry, predicate, field));
        }

        if (!JsonLoader.isObject(value)) {
            return [];
        }

        return Object.entries(value).flatMap(([key, entry]) =>
            JsonLoader.collectStrings(entry, predicate, field === "" ? key : field + "." + key)
        );
    }

    constructor(storage: Storage) {
        this.storage = storage;
    }

    read(path: string): Promise<JsonReadResult> {
        return this.cache.get(path, () => this.load(path));
    }

    async readObject(path: string): Promise<JsonObject | undefined> {
        const result = await this.read(path);

        return JsonLoader.isObject(result.value) ? result.value : undefined;
    }

    async readValue(path: string): Promise<JsonValue | undefined> {
        const result = await this.read(path);

        return result.status === "ok" ? result.value : undefined;
    }

    private async load(path: string): Promise<JsonReadResult> {
        let bytes: Uint8Array;

        try {
            bytes = await this.storage.readBytes(path);
        } catch (error) {
            return { status: "unreadable", hasByteOrderMark: false, error: ToolError.describe(error) };
        }

        let text: string;

        try {
            text = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(bytes);
        } catch {
            return { status: "not_utf8", hasByteOrderMark: false };
        }

        const hasByteOrderMark = text.startsWith(JsonLoader.BYTE_ORDER_MARK);
        const content = hasByteOrderMark ? text.slice(1) : text;

        if (content.trim().length < JsonLoader.MINIMUM_CONTENT_LENGTH) {
            return { status: "empty", hasByteOrderMark, text: content };
        }

        try {
            return { status: "ok", value: JsoncParser.parse(content), hasByteOrderMark, text: content };
        } catch (error) {
            return { status: "invalid", hasByteOrderMark, text: content, error: ToolError.describe(error) };
        }
    }
}
