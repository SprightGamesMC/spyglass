import type Check from "../../../src/Checks/Check.js";
import type { FindingSummary, FixtureFiles } from "../../Types/Core/FixtureTypes.js";
import type { WorldIconCase } from "../../Types/World/WorldIconFixtureTypes.js";
import ImageBytes from "../Core/ImageBytes.js";
import ModelFixture from "../Core/ModelFixture.js";

export default abstract class WorldIconFixture {
    static readonly WORLD_ROOT = "World";

    static run(check: Check, entry: WorldIconCase): Promise<FindingSummary> {
        const files: Record<string, FixtureFiles[string]> = {
            [WorldIconFixture.WORLD_ROOT + "/manifest.json"]: ModelFixture.worldTemplateManifest(),
        };

        for (const icon of entry.icons) {
            files[WorldIconFixture.WORLD_ROOT + "/" + icon.name] =
                icon.width === undefined || icon.height === undefined
                    ? "not an image"
                    : ImageBytes.jpeg({ width: icon.width, height: icon.height });
        }

        if (entry.education === true) {
            files[WorldIconFixture.WORLD_ROOT + "/education.json"] = { is_education: true };
        }

        return ModelFixture.summary(check, files, { contentType: "world" });
    }
}
