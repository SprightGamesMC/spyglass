import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { TooManyTextureHandlesReportsOverLimitCase } from "../Types/TooManyTextureHandlesReportsOverLimitTypes.js";
import TooManyTextureHandles from "../../src/Checks/Addon/TooManyTextureHandles.js";
import AddonFixture from "./Core/AddonFixture.js";
import ModelFixture from "./Core/ModelFixture.js";

export default abstract class TooManyTextureHandlesReportsOverLimit {
    static readonly ID = "ADDON/405";
    static readonly CASES: readonly TooManyTextureHandlesReportsOverLimitCase[] = [
        { name: "800 texture handles is at the limit", handleCount: 800, expectedIds: [] },
        { name: "801 texture handles is above the limit", handleCount: 801, expectedIds: ["ADDON/405"] },
    ];

    static async run(entry: TooManyTextureHandlesReportsOverLimitCase): Promise<FindingSummary> {
        const textures: Record<string, string> = {};

        for (let index = 0; index < entry.handleCount; index += 1) {
            textures["t" + index] = "textures/entity/spright_cave/mob" + index;
        }

        const files = {
            [AddonFixture.RP + "manifest.json"]: ModelFixture.resourceManifest(),
            [AddonFixture.RP + "entity/mob.entity.json"]: {
                "minecraft:client_entity": { description: { identifier: "spright_cave:mob", textures } },
            },
        };

        return AddonFixture.run(new TooManyTextureHandles(), files);
    }
}
