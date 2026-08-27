import type Check from "../../../src/Checks/Check.js";
import type { Finding } from "../../../src/Types/CheckTypes.js";
import type { FindingSummary, FixtureFiles } from "../../Types/Core/FixtureTypes.js";
import type { TextureCase } from "../../Types/Core/TextureFixtureTypes.js";
import ImageBytes from "./ImageBytes.js";
import ModelFixture from "./ModelFixture.js";

export default abstract class TextureFixture {
    private static readonly PACK_ROOT = "RP";

    static resourcePack(files: FixtureFiles, manifestOverrides: Record<string, unknown> = {}): FixtureFiles {
        const prefixed: Record<string, FixtureFiles[string]> = {
            [TextureFixture.PACK_ROOT + "/manifest.json"]: ModelFixture.resourceManifest(manifestOverrides),
        };

        for (const [path, content] of Object.entries(files)) {
            prefixed[TextureFixture.PACK_ROOT + "/" + path] = content;
        }

        return prefixed;
    }

    static subpacks(...tiers: readonly number[]): Record<string, unknown> {
        return { subpacks: tiers.map((tier) => ({ folder_name: "tier" + tier, name: "Tier " + tier, memory_performance_tier: tier })) };
    }

    static image(width: number, height: number): Uint8Array {
        return ImageBytes.jpeg({ width, height });
    }

    static png(width: number, height: number): Uint8Array {
        return ImageBytes.png({ width, height });
    }

    static run(check: Check, entry: TextureCase): Promise<Finding[]> {
        return ModelFixture.findings(check, entry.files, entry.options);
    }

    static summary(check: Check, entry: TextureCase): Promise<FindingSummary> {
        return ModelFixture.summary(check, entry.files, entry.options);
    }
}
