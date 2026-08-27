import type { CheckDefinition } from "../../Types/CheckTypes.js";
import type { JsonReadResult } from "../../Types/LoaderTypes.js";
import JsonReadStatusCheck from "../Common/JsonReadStatusCheck.js";
import FileChecks from "./FileChecks.js";

export default class ByteOrderMark extends JsonReadStatusCheck {
    readonly definition: CheckDefinition = {
        group: FileChecks.GROUP,
        number: FileChecks.BYTE_ORDER_MARK,
        slug: "byte-order-mark",
        severity: "error",
        description: "JSON file starts with a byte order mark",
    };

    protected matches(result: JsonReadResult): boolean {
        return result.hasByteOrderMark;
    }

    protected message(): string {
        return "JSON file starts with a UTF-8 byte order mark";
    }
}
