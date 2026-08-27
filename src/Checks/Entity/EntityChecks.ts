import type Check from "../Check.js";
import type { CheckGroup } from "../../Types/CheckTypes.js";
import MinecraftRuntimeIdentifier from "./MinecraftRuntimeIdentifier.js";

export default abstract class EntityChecks {
    static readonly GROUP: CheckGroup = "ENTITY";
    static readonly MINECRAFT_RUNTIME_IDENTIFIER = 601;

    static create(): Check[] {
        return [new MinecraftRuntimeIdentifier()];
    }
}
