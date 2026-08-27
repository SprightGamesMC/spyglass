import type { ItemKind, PackType } from "../../Types/ModelTypes.js";
import EntitySchema from "../../Data/Schemas/EntitySchema.js";
import PackItemLoader from "../../Loaders/PackItemLoader.js";

export default abstract class EntityLimits {
    static readonly KINDS: readonly ItemKind[] = ["entity_behavior"];
    static readonly PACK_TYPE: PackType = PackItemLoader.BEHAVIOR_PACK_TYPE;
    static readonly RUNTIME_IDENTIFIER_PATH: readonly string[] = [EntitySchema.ROOT_KEY, "description", "runtime_identifier"];
}
