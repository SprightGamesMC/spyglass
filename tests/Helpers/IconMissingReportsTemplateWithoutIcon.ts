import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { IconMissingReportsTemplateWithoutIconCase } from "../Types/IconMissingReportsTemplateWithoutIconTypes.js";
import IconMissing from "../../src/Checks/World/IconMissing.js";
import WorldIconFixture from "./World/WorldIconFixture.js";

export default abstract class IconMissingReportsTemplateWithoutIcon {
    static readonly ID = "WORLD/102";
    static readonly CASES: readonly IconMissingReportsTemplateWithoutIconCase[] = [
        {
            name: "world_icon.jpeg at 800 by 450 is present",
            icons: [{ name: "world_icon.jpeg", width: 800, height: 450 }],
            expectedIds: [],
            expectedPaths: [],
        },
        { name: "template without world_icon.jpeg has no icon", icons: [], expectedIds: ["WORLD/102"], expectedPaths: ["World"] },
        {
            name: "world_icon.png is not a jpeg so it does not count as the icon",
            icons: [{ name: "world_icon.png", width: 800, height: 450 }],
            expectedIds: ["WORLD/102"],
            expectedPaths: ["World"],
        },
    ];

    static run(entry: IconMissingReportsTemplateWithoutIconCase): Promise<FindingSummary> {
        return WorldIconFixture.run(new IconMissing(), entry);
    }
}
