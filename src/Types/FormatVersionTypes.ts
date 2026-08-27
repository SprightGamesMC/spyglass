import type { GameVersion } from "./LoaderTypes.js";

type FormatVersionStatus = "ok" | "missing" | "unparseable" | "skipped";

export interface FormatVersionResult {
    readonly status: FormatVersionStatus;
    readonly version?: GameVersion;
    readonly text?: string;
}
