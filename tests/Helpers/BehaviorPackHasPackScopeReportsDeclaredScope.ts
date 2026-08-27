import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { BehaviorPackHasPackScopeReportsDeclaredScopeCase } from "../Types/BehaviorPackHasPackScopeReportsDeclaredScopeTypes.js";
import BehaviorPackHasPackScope from "../../src/Checks/Marketplace/BehaviorPackHasPackScope.js";
import ModelFixture from "./Core/ModelFixture.js";
import MarketplaceFixture from "./Marketplace/MarketplaceFixture.js";

export default abstract class BehaviorPackHasPackScopeReportsDeclaredScope {
    static readonly ID = "MARKETPLACE/204";
    static readonly CASES: readonly BehaviorPackHasPackScopeReportsDeclaredScopeCase[] = [
        {
            name: "behavior manifest without pack_scope declares no scope",
            files: MarketplaceFixture.addonSubmission(),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "behavior manifest with pack_scope world declares a scope add-ons must not set",
            files: {
                ...MarketplaceFixture.addonSubmission(),
                [MarketplaceFixture.BEHAVIOR_MANIFEST]: ModelFixture.withHeader(MarketplaceFixture.behaviorManifest(), {
                    pack_scope: "world",
                }),
            },
            expectedIds: ["MARKETPLACE/204"],
            expectedPaths: [MarketplaceFixture.BEHAVIOR_MANIFEST],
        },
    ];

    static async run(entry: BehaviorPackHasPackScopeReportsDeclaredScopeCase): Promise<FindingSummary> {
        return MarketplaceFixture.run(new BehaviorPackHasPackScope(), entry);
    }
}
