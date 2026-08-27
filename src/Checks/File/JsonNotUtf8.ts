import type { CheckDefinition } from "../../Types/CheckTypes.js";
import type { JsonReadResult } from "../../Types/LoaderTypes.js";
import JsonReadStatusCheck from "../Common/JsonReadStatusCheck.js";
import FileChecks from "./FileChecks.js";

export default class JsonNotUtf8 extends JsonReadStatusCheck {
    readonly definition: CheckDefinition = {
        group: FileChecks.GROUP,
        number: FileChecks.JSON_NOT_UTF8,
        slug: "json-not-utf8",
        severity: "error",
        description: "JSON file is not valid UTF-8 text",
    };

    protected matches(result: JsonReadResult): boolean {
        return result.status === "not_utf8";
    }

    protected message(): string {
        return "JSON file does not decode as UTF-8";
    }
}
