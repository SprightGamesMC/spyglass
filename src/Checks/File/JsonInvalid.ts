import type { CheckDefinition } from "../../Types/CheckTypes.js";
import type { JsonReadResult } from "../../Types/LoaderTypes.js";
import type { FileEntry } from "../../Types/StorageTypes.js";
import JsonReadStatusCheck from "../Common/JsonReadStatusCheck.js";
import FileChecks from "./FileChecks.js";

export default class JsonInvalid extends JsonReadStatusCheck {
    readonly definition: CheckDefinition = {
        group: FileChecks.GROUP,
        number: FileChecks.JSON_INVALID,
        slug: "json-invalid",
        severity: "error",
        description: "File does not parse as JSON",
    };

    protected matches(result: JsonReadResult): boolean {
        return result.status === "invalid";
    }

    protected message(_file: FileEntry, result: JsonReadResult): string {
        return "JSON does not parse: " + (result.error ?? "syntax error");
    }
}
