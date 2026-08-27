import type { FindingSummary, FixtureFiles } from "../Types/Core/FixtureTypes.js";
import type { BaseContentUnusedInLowerTiersReportsHighOverlapCase } from "../Types/BaseContentUnusedInLowerTiersReportsHighOverlapTypes.js";
import BaseContentUnusedInLowerTiers from "../../src/Checks/Texture/BaseContentUnusedInLowerTiers.js";
import TextureFixture from "./Core/TextureFixture.js";

export default abstract class BaseContentUnusedInLowerTiersReportsHighOverlap {
    static readonly ID = "TEXTURE/303";
    static readonly CASES: readonly BaseContentUnusedInLowerTiersReportsHighOverlapCase[] = [
        {
            name: "lowest subpack tier 1 is below the tier 2 minimum so overlap is not checked",
            files: BaseContentUnusedInLowerTiersReportsHighOverlap.files(1, ["a", "b", "c"], ["a", "b", "c"]),
            expectedIds: [],
        },
        {
            name: "tier 2 overriding 3 of 5 base textures is 60 percent overlap which is under 80 percent",
            files: BaseContentUnusedInLowerTiersReportsHighOverlap.files(2, ["a", "b", "c", "d", "e"], ["a", "b", "c"]),
            expectedIds: [],
        },
        {
            name: "tier 2 overriding 4 of 5 base textures is 80 percent overlap which reaches the limit",
            files: BaseContentUnusedInLowerTiersReportsHighOverlap.files(2, ["a", "b", "c", "d", "e"], ["a", "b", "c", "d"]),
            expectedIds: [BaseContentUnusedInLowerTiersReportsHighOverlap.ID],
            expectedPaths: ["RP/manifest.json"],
        },
    ];

    static files(tier: number, baseNames: readonly string[], subpackNames: readonly string[]): FixtureFiles {
        const files: Record<string, Uint8Array> = {};

        for (const name of baseNames) {
            files["textures/entity/" + name + ".png"] = TextureFixture.png(16, 16);
        }

        for (const name of subpackNames) {
            files["subpacks/tier" + tier + "/textures/entity/" + name + ".png"] = TextureFixture.png(16, 16);
        }

        return TextureFixture.resourcePack(files, TextureFixture.subpacks(tier, 4));
    }

    static run(entry: BaseContentUnusedInLowerTiersReportsHighOverlapCase): Promise<FindingSummary> {
        return TextureFixture.summary(new BaseContentUnusedInLowerTiers(), entry);
    }
}
