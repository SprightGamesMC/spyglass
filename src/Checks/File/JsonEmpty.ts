import type { CheckDefinition } from "../../Types/CheckTypes.js";
import type { JsonReadResult } from "../../Types/LoaderTypes.js";
import type { FileEntry } from "../../Types/StorageTypes.js";
import JsonReadStatusCheck from "../Common/JsonReadStatusCheck.js";
import FileChecks from "./FileChecks.js";

export default class JsonEmpty extends JsonReadStatusCheck {
    readonly definition: CheckDefinition = {
        group: FileChecks.GROUP,
        number: FileChecks.JSON_EMPTY,
        slug: "json-empty",
        severity: "error",
        description: "JSON file is empty",
    };

    protected matches(result: JsonReadResult): boolean {
        return result.status === "empty";
    }

    protected message(file: FileEntry): string {
        return "JSON file is empty, " + file.size + " bytes";
    }
}
