import type Check from "../Check.js";
import type { CheckGroup } from "../../Types/CheckTypes.js";
import BetaModuleOutdated from "./BetaModuleOutdated.js";
import FunctionEngineVersionTooLow from "./FunctionEngineVersionTooLow.js";
import McfunctionLeadingSlash from "./McfunctionLeadingSlash.js";
import UnknownCommand from "./UnknownCommand.js";
import UseBetaFeatures from "./UseBetaFeatures.js";

export default abstract class ScriptChecks {
    static readonly GROUP: CheckGroup = "SCRIPT";
    static readonly UNKNOWN_COMMAND = 201;
    static readonly MCFUNCTION_LEADING_SLASH = 202;
    static readonly BETA_MODULE_OUTDATED = 501;
    static readonly FUNCTION_ENGINE_VERSION_TOO_LOW = 502;
    static readonly USE_BETA_FEATURES = 701;

    static create(): Check[] {
        return [
            new UnknownCommand(),
            new McfunctionLeadingSlash(),
            new BetaModuleOutdated(),
            new FunctionEngineVersionTooLow(),
            new UseBetaFeatures(),
        ];
    }
}
