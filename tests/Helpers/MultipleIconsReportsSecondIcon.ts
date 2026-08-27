import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { MultipleIconsReportsSecondIconCase } from "../Types/MultipleIconsReportsSecondIconTypes.js";
import MultipleIcons from "../../src/Checks/World/MultipleIcons.js";
import WorldIconFixture from "./World/WorldIconFixture.js";

export default abstract class MultipleIconsReportsSecondIcon {
    static readonly ID = "WORLD/601";
    static readonly CASES: readonly MultipleIconsReportsSecondIconCase[] = [
        {
            name: "one world_icon.jpeg is a single icon",
            icons: [{ name: "world_icon.jpeg", width: 800, height: 450 }],
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "world_icon.jpeg beside world_icon.png counts as one icon because png is not an icon",
            icons: [
                { name: "world_icon.jpeg", width: 800, height: 450 },
                { name: "world_icon.png", width: 800, height: 450 },
            ],
            expectedIds: [],
            expectedPaths: [],
        },
        {
            name: "world_icon.jpeg and world_icon_2.jpeg are more than one icon",
            icons: [
                { name: "world_icon.jpeg", width: 800, height: 450 },
                { name: "world_icon_2.jpeg", width: 800, height: 450 },
            ],
            expectedIds: ["WORLD/601"],
            expectedPaths: ["World"],
        },
    ];

    static run(entry: MultipleIconsReportsSecondIconCase): Promise<FindingSummary> {
        return WorldIconFixture.run(new MultipleIcons(), entry);
    }
}
