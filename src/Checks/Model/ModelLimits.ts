import type { ItemKind } from "../../Types/ModelTypes.js";

export default abstract class ModelLimits {
    static readonly BLOCK_CUBE_LIMIT = 50;
    static readonly BLOCK_PATH_MARKER = "/blocks/";
    static readonly MESH_FIELDS: readonly string[] = ["poly_mesh", "texture_mesh"];
    static readonly KINDS: readonly ItemKind[] = ["geometry"];
}
