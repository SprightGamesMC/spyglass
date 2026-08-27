import type Check from "../Check.js";
import type { CheckGroup } from "../../Types/CheckTypes.js";
import BlockGeometryTooComplex from "./BlockGeometryTooComplex.js";
import MeshNotAllowed from "./MeshNotAllowed.js";

export default abstract class ModelChecks {
    static readonly GROUP: CheckGroup = "MODEL";
    static readonly MESH_NOT_ALLOWED = 201;
    static readonly BLOCK_GEOMETRY_TOO_COMPLEX = 401;

    static create(): Check[] {
        return [new MeshNotAllowed(), new BlockGeometryTooComplex()];
    }
}
