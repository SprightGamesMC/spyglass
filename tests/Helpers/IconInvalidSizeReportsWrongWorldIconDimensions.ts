import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { IconInvalidSizeReportsWrongWorldIconDimensionsCase } from "../Types/IconInvalidSizeReportsWrongWorldIconDimensionsTypes.js";
import IconInvalidSize from "../../src/Checks/World/IconInvalidSize.js";
import WorldIconFixture from "./World/WorldIconFixture.js";

export default abstract class IconInvalidSizeReportsWrongWorldIconDimensions {
    static readonly ID = "WORLD/202";
    static readonly CASES: readonly IconInvalidSizeReportsWrongWorldIconDimensionsCase[] = [
        {
            name: "800 by 450 icon has the expected size",
            icons: [{ name: "world_icon.jpeg", width: 800, height: 450 }],
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "world_icon.jpeg with non image bytes has no size to check",
            icons: [{ name: "world_icon.jpeg" }],
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "480 by 270 icon is not 800 by 450",
            icons: [{ name: "world_icon.jpeg", width: 480, height: 270 }],
            expectedIds: ["WORLD/202"],
            expectedPaths: ["World/world_icon.jpeg"],
        },
        {
            name: "480 by 270 icon is allowed for an education project",
            icons: [{ name: "world_icon.jpeg", width: 480, height: 270 }],
            education: true,
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "400 by 300 icon is not 800 by 450 or 480 by 270 even for an education project",
            icons: [{ name: "world_icon.jpeg", width: 400, height: 300 }],
            education: true,
            expectedIds: ["WORLD/202"],
            expectedPaths: ["World/world_icon.jpeg"],
        },
    ];

    static run(entry: IconInvalidSizeReportsWrongWorldIconDimensionsCase): Promise<FindingSummary> {
        return WorldIconFixture.run(new IconInvalidSize(), entry);
    }
}
