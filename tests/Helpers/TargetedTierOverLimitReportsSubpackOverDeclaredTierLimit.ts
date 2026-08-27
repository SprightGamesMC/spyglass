import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { TargetedTierOverLimitReportsSubpackOverDeclaredTierLimitCase } from "../Types/TargetedTierOverLimitReportsSubpackOverDeclaredTierLimitTypes.js";
import TargetedTierOverLimit from "../../src/Checks/Texture/TargetedTierOverLimit.js";
import TextureFixture from "./Core/TextureFixture.js";

export default abstract class TargetedTierOverLimitReportsSubpackOverDeclaredTierLimit {
    static readonly ID = "TEXTURE/407";
    static readonly CASES: readonly TargetedTierOverLimitReportsSubpackOverDeclaredTierLimitCase[] = [
        {
            name: "256 MiB addon without subpacks targets no tier so no tier limit applies",
            files: TextureFixture.resourcePack({ "textures/entity/big.jpg": TextureFixture.image(8192, 8192) }),
            expectedIds: [],
        },
        {
            name: "256 MiB addon with a tier 3 subpack is under the 300 MiB tier 3 limit",
            files: TargetedTierOverLimitReportsSubpackOverDeclaredTierLimit.files(3),
            expectedIds: [],
        },
        {
            name: "256 MiB addon with a tier 2 subpack is over the 225 MiB tier 2 limit",
            files: TargetedTierOverLimitReportsSubpackOverDeclaredTierLimit.files(2),
            expectedIds: [TargetedTierOverLimitReportsSubpackOverDeclaredTierLimit.ID],
            expectedPaths: ["RP/manifest.json"],
        },
    ];

    static files(tier: number): ReturnType<typeof TextureFixture.resourcePack> {
        return TextureFixture.resourcePack(
            {
                "textures/entity/big.jpg": TextureFixture.image(8192, 8192),
                ["subpacks/tier" + tier + "/textures/entity/small.png"]: TextureFixture.png(16, 16),
            },
            TextureFixture.subpacks(tier)
        );
    }

    static run(entry: TargetedTierOverLimitReportsSubpackOverDeclaredTierLimitCase): Promise<FindingSummary> {
        return TextureFixture.summary(new TargetedTierOverLimit(), entry);
    }
}
