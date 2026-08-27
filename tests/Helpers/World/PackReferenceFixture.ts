import type Check from "../../../src/Checks/Check.js";
import type { Finding } from "../../../src/Types/CheckTypes.js";
import ModelFixture from "../Core/ModelFixture.js";

export default abstract class PackReferenceFixture {
    static readonly PATH = "World/world_behavior_packs.json";

    static run(check: Check, content: object | string): Promise<Finding[]> {
        const files = {
            "World/manifest.json": ModelFixture.worldTemplateManifest(),
            [PackReferenceFixture.PATH]: content,
            "World/behavior_packs/BP/manifest.json": ModelFixture.behaviorManifest(),
        };

        return ModelFixture.findings(check, files, { contentType: "world" });
    }
}
