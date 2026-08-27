import type { JsonObject } from "./LoaderTypes.js";
import type { SchemaIssue } from "./SchemaTypes.js";

type ManifestShapeStatus = "ok" | "unparsed" | "invalid";

export interface ManifestShapeResult {
    readonly status: ManifestShapeStatus;
    readonly manifest?: JsonObject;
    readonly issues: readonly SchemaIssue[];
}
