import type Check from "../Check.js";
import type { CheckGroup } from "../../Types/CheckTypes.js";
import FormatVersionAboveExpected from "./FormatVersionAboveExpected.js";
import FormatVersionBelowExpected from "./FormatVersionBelowExpected.js";
import FormatVersionMissing from "./FormatVersionMissing.js";
import MinecraftIdentifier from "./MinecraftIdentifier.js";
import SchemaInvalid from "./SchemaInvalid.js";

export default abstract class DefinitionChecks {
    static readonly GROUP: CheckGroup = "DEFINITION";
    static readonly FORMAT_VERSION_MISSING = 101;
    static readonly SCHEMA_INVALID = 201;
    static readonly FORMAT_VERSION_BELOW_EXPECTED = 501;
    static readonly FORMAT_VERSION_ABOVE_EXPECTED = 502;
    static readonly MINECRAFT_IDENTIFIER = 601;

    static create(): Check[] {
        return [
            new FormatVersionMissing(),
            new SchemaInvalid(),
            new FormatVersionBelowExpected(),
            new FormatVersionAboveExpected(),
            new MinecraftIdentifier(),
        ];
    }
}
