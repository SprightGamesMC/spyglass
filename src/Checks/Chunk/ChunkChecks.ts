import type Check from "../Check.js";
import type { CheckGroup } from "../../Types/CheckTypes.js";
import CommandFromOlderVersion from "./CommandFromOlderVersion.js";
import DimensionMappingUnclaimed from "./DimensionMappingUnclaimed.js";
import DimensionTableMissing from "./DimensionTableMissing.js";
import UnknownCommand from "./UnknownCommand.js";

export default abstract class ChunkChecks {
    static readonly GROUP: CheckGroup = "CHUNK";
    static readonly DIMENSION_TABLE_MISSING = 101;
    static readonly UNKNOWN_COMMAND = 201;
    static readonly DIMENSION_MAPPING_UNCLAIMED = 301;
    static readonly COMMAND_FROM_OLDER_VERSION = 501;

    static create(): Check[] {
        return [new DimensionTableMissing(), new UnknownCommand(), new DimensionMappingUnclaimed(), new CommandFromOlderVersion()];
    }
}
