import type Check from "../../../src/Checks/Check.js";
import type { Finding } from "../../../src/Types/CheckTypes.js";
import type { WorldTemplateCase } from "../../Types/World/WorldTemplateFixtureTypes.js";
import ModelFixture from "../Core/ModelFixture.js";

export default abstract class WorldTemplateFixture {
    static readonly MANIFEST_PATH = "World/manifest.json";

    static run(check: Check, entry: WorldTemplateCase): Promise<Finding[]> {
        const base = ModelFixture.worldTemplateManifest();
        const header = { ...(base.header as Record<string, unknown>) };

        delete header.base_game_version;
        delete header.lock_template_options;

        const manifest = ModelFixture.withHeader({ ...base, format_version: entry.formatVersion ?? 2, header }, entry.header ?? {});
        const files = { [WorldTemplateFixture.MANIFEST_PATH]: manifest };

        return ModelFixture.findings(check, files, { contentType: "world", currentGameVersion: ModelFixture.FICTIONAL_GAME_VERSION });
    }
}
