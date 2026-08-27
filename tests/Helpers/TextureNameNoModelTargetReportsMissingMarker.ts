import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { TextureNameNoModelTargetReportsMissingMarkerCase } from "../Types/TextureNameNoModelTargetReportsMissingMarkerTypes.js";
import TextureNameNoModelTarget from "../../src/Checks/Skin/TextureNameNoModelTarget.js";
import SkinPackFixture from "./Core/SkinPackFixture.js";

export default abstract class TextureNameNoModelTargetReportsMissingMarker {
    static readonly ID = "SKIN/205";
    static readonly CASES: readonly TextureNameNoModelTargetReportsMissingMarkerCase[] = [
        { name: "steve and alex texture names have a model marker", expectedIds: [], expectedPaths: [] },
        {
            name: "hero_customSlim.png ends with a slim model marker",
            skinsJson: SkinPackFixture.skinsJson([SkinPackFixture.skin({ texture: "hero_customSlim.png" })]),
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "hero.png has no model marker",
            skinsJson: SkinPackFixture.skinsJson([SkinPackFixture.skin({ texture: "hero.png" })]),
            expectedIds: ["SKIN/205"],
            expectedPaths: [SkinPackFixture.SKINS_JSON_PATH],
        },
        {
            name: "hero_a_thing.png does not end with the a marker so it has no model marker",
            skinsJson: SkinPackFixture.skinsJson([SkinPackFixture.skin({ texture: "hero_a_thing.png" })]),
            expectedIds: ["SKIN/205"],
            expectedPaths: [SkinPackFixture.SKINS_JSON_PATH],
        },
    ];

    static run(entry: TextureNameNoModelTargetReportsMissingMarkerCase): Promise<FindingSummary> {
        return SkinPackFixture.run(new TextureNameNoModelTarget(), entry);
    }
}
