import type { CheckContext } from "../Types/CheckTypes.js";
import type { LanguageCatalog } from "../Types/LanguageCatalogTypes.js";
import type { ContentItem, Pack } from "../Types/ModelTypes.js";
import PathUtilities from "../Storage/PathUtilities.js";
import JsonLoader from "./JsonLoader.js";

export default abstract class LanguageCatalogReader {
    static readonly TEXTS_FOLDER = "texts";
    static readonly PRIMARY_LANGUAGE = "en_US";
    static readonly LANG_EXTENSION = ".lang";
    static readonly PRIMARY_LANG_FILE = LanguageCatalogReader.PRIMARY_LANGUAGE + LanguageCatalogReader.LANG_EXTENSION;
    static readonly LANGUAGES_FILE = "languages.json";
    static readonly LANGUAGE_NAMES_FILES: readonly string[] = ["language_names.json", "languages_names.json"];

    static async read(context: CheckContext, pack: Pack): Promise<LanguageCatalog> {
        const langFiles = pack.items.filter((item) => item.kind === "lang" && LanguageCatalogReader.isInTexts(item));
        const item = pack.items.find((candidate) => candidate.kind === "languages" && LanguageCatalogReader.isInTexts(candidate));

        if (item === undefined) {
            return { status: "missing", codes: [], langFiles };
        }

        const result = await context.loaders.json.read(item.path);

        if (result.status !== "ok") {
            return { status: "skipped", item, codes: [], langFiles };
        }

        if (!JsonLoader.isArray(result.value) || !result.value.every((entry) => typeof entry === "string")) {
            return { status: "invalid", item, codes: [], langFiles };
        }

        return { status: "ok", item, codes: result.value as string[], langFiles };
    }

    private static isInTexts(item: ContentItem): boolean {
        return PathUtilities.firstSegment(item.packPath) === LanguageCatalogReader.TEXTS_FOLDER;
    }
}
