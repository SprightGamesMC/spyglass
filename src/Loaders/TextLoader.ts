import type { TextReadResult } from "../Types/LoaderTypes.js";
import type { Storage } from "../Types/StorageTypes.js";
import ToolError from "../Errors/ToolError.js";
import JsonLoader from "./JsonLoader.js";
import PromiseCache from "./PromiseCache.js";

export default class TextLoader {
    private readonly storage: Storage;
    private readonly cache = new PromiseCache<TextReadResult>();

    constructor(storage: Storage) {
        this.storage = storage;
    }

    read(path: string): Promise<TextReadResult> {
        return this.cache.get(path, () => this.load(path));
    }

    async readText(path: string): Promise<string | undefined> {
        const result = await this.read(path);

        return result.status === "ok" ? result.text : undefined;
    }

    async readLines(path: string): Promise<string[] | undefined> {
        const text = await this.readText(path);

        return text?.split(/\r?\n/);
    }

    async readLangEntries(path: string): Promise<Map<string, string> | undefined> {
        const lines = await this.readLines(path);

        if (lines === undefined) {
            return undefined;
        }

        const entries = new Map<string, string>();

        for (const line of lines) {
            const withoutComment = line.split("##")[0];
            const separator = withoutComment.indexOf("=");

            if (separator <= 0) {
                continue;
            }

            entries.set(withoutComment.slice(0, separator).trim(), withoutComment.slice(separator + 1).replace(/\t.*$/, ""));
        }

        return entries;
    }

    private async load(path: string): Promise<TextReadResult> {
        let bytes: Uint8Array;

        try {
            bytes = await this.storage.readBytes(path);
        } catch (error) {
            return { status: "unreadable", error: ToolError.describe(error) };
        }

        const text = new TextDecoder("utf-8").decode(bytes);

        return { status: "ok", text: text.startsWith(JsonLoader.BYTE_ORDER_MARK) ? text.slice(1) : text };
    }
}
