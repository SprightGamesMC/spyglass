import type Check from "../../../src/Checks/Check.js";
import type { Finding } from "../../../src/Types/CheckTypes.js";
import type { DefinitionFormatVersionCase } from "../../Types/Core/SharedCaseTypes.js";
import ModelFixture from "./ModelFixture.js";

export default abstract class FormatVersionFixture {
    private static readonly VANILLA_FORMAT_VERSION = "10.28.40";

    static expected(check: Check, entry: DefinitionFormatVersionCase): Promise<Finding[]> {
        const files = {
            "BP/manifest.json": ModelFixture.behaviorManifest(),
            "RP/manifest.json": ModelFixture.resourceManifest(),
            [entry.path]: { format_version: entry.formatVersion, [entry.rootKey]: {} },
        };

        const formatVersions = {
            fog: FormatVersionFixture.VANILLA_FORMAT_VERSION,
            spawn_rule: FormatVersionFixture.VANILLA_FORMAT_VERSION,
            render_controller: FormatVersionFixture.VANILLA_FORMAT_VERSION,
            texture_set: FormatVersionFixture.VANILLA_FORMAT_VERSION,
        };

        return ModelFixture.findings(check, files, {
            currentGameVersion: ModelFixture.FICTIONAL_GAME_VERSION,
            vanilla: { files: {}, properties: {}, formatVersions },
        });
    }
}
