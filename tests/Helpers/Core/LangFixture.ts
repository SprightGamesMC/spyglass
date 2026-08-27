import type { FixtureFiles } from "../../Types/Core/FixtureTypes.js";
import ModelFixture from "./ModelFixture.js";

export default abstract class LangFixture {
    static readonly PACK_ROOT = "RP";
    static readonly TEXTS_FOLDER = LangFixture.PACK_ROOT + "/texts";
    static readonly CATALOG_PATH = LangFixture.TEXTS_FOLDER + "/languages.json";

    static resourcePack(texts: FixtureFiles): FixtureFiles {
        const files: Record<string, FixtureFiles[string]> = { [LangFixture.PACK_ROOT + "/manifest.json"]: ModelFixture.resourceManifest() };

        for (const [name, content] of Object.entries(texts)) {
            files[LangFixture.TEXTS_FOLDER + "/" + name] = content;
        }

        return files;
    }

    static langPath(code: string): string {
        return LangFixture.TEXTS_FOLDER + "/" + code + ".lang";
    }
}
