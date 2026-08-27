import type Check from "../Check.js";
import type { CheckGroup } from "../../Types/CheckTypes.js";
import ByteOrderMark from "./ByteOrderMark.js";
import FileUnreadable from "./FileUnreadable.js";
import JsonEmpty from "./JsonEmpty.js";
import JsonInvalid from "./JsonInvalid.js";
import JsonNotUtf8 from "./JsonNotUtf8.js";
import PathCaseCollision from "./PathCaseCollision.js";
import PathHasUppercase from "./PathHasUppercase.js";
import PathInvalidCharacter from "./PathInvalidCharacter.js";
import PathTooDeep from "./PathTooDeep.js";
import PathTooLong from "./PathTooLong.js";

export default abstract class FileChecks {
    static readonly GROUP: CheckGroup = "FILE";
    static readonly JSON_INVALID = 201;
    static readonly JSON_EMPTY = 202;
    static readonly JSON_NOT_UTF8 = 203;
    static readonly BYTE_ORDER_MARK = 204;
    static readonly PATH_HAS_UPPERCASE = 205;
    static readonly PATH_INVALID_CHARACTER = 206;
    static readonly FILE_UNREADABLE = 207;
    static readonly PATH_TOO_LONG = 401;
    static readonly PATH_TOO_DEEP = 402;
    static readonly PATH_CASE_COLLISION = 601;

    static create(): Check[] {
        return [
            new JsonInvalid(),
            new JsonEmpty(),
            new JsonNotUtf8(),
            new ByteOrderMark(),
            new PathHasUppercase(),
            new PathInvalidCharacter(),
            new FileUnreadable(),
            new PathTooLong(),
            new PathTooDeep(),
            new PathCaseCollision(),
        ];
    }
}
