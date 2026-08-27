import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { GeometryNotAllowedReportsNonHumanoidGeometryCase } from "../Types/GeometryNotAllowedReportsNonHumanoidGeometryTypes.js";
import GeometryNotAllowed from "../../src/Checks/Skin/GeometryNotAllowed.js";
import SkinPackFixture from "./Core/SkinPackFixture.js";

export default abstract class GeometryNotAllowedReportsNonHumanoidGeometry {
    static readonly ID = "SKIN/204";
    static readonly CASES: readonly GeometryNotAllowedReportsNonHumanoidGeometryCase[] = [
        {
            name: "geometry.humanoid.custom and geometry.humanoid.customSlim are humanoid custom models",
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "geometry.humanoid is not a humanoid custom model",
            skinsJson: SkinPackFixture.skinsJson([SkinPackFixture.skin({ geometry: "geometry.humanoid" })]),
            expectedIds: ["SKIN/204"],
            expectedPaths: [SkinPackFixture.SKINS_JSON_PATH],
        },
    ];

    static run(entry: GeometryNotAllowedReportsNonHumanoidGeometryCase): Promise<FindingSummary> {
        return SkinPackFixture.run(new GeometryNotAllowed(), entry);
    }
}
