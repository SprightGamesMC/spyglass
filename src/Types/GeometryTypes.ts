import type { JsonObject } from "./LoaderTypes.js";

export interface GeometryDefinition {
    readonly identifier: string;
    readonly bones: readonly JsonObject[];
}
