import type { PackType } from "../../src/Types/ModelTypes.js";

export interface ExpectedPack {
    readonly root: string;
    readonly type: PackType;
}
