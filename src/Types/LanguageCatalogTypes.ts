import type { ContentItem } from "./ModelTypes.js";

type LanguageCatalogStatus = "ok" | "missing" | "invalid" | "skipped";

export interface LanguageCatalog {
    readonly status: LanguageCatalogStatus;
    readonly item?: ContentItem;
    readonly codes: readonly string[];
    readonly langFiles: readonly ContentItem[];
}
