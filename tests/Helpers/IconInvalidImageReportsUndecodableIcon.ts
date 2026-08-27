import type { FindingSummary } from "../Types/Core/FixtureTypes.js";
import type { IconInvalidImageReportsUndecodableIconCase } from "../Types/IconInvalidImageReportsUndecodableIconTypes.js";
import IconInvalidImage from "../../src/Checks/World/IconInvalidImage.js";
import WorldIconFixture from "./World/WorldIconFixture.js";

export default abstract class IconInvalidImageReportsUndecodableIcon {
    static readonly ID = "WORLD/201";
    static readonly CASES: readonly IconInvalidImageReportsUndecodableIconCase[] = [
        {
            name: "world_icon.jpeg with jpeg bytes can be decoded",
            icons: [{ name: "world_icon.jpeg", width: 800, height: 450 }],
            expectedIds: [],
            expectedPaths: [],
        },
        { name: "template without world_icon.jpeg has nothing to decode", icons: [], expectedIds: [], expectedPaths: [] },
        {
            name: "world_icon.jpeg with non image bytes cannot be decoded",
            icons: [{ name: "world_icon.jpeg" }],
            expectedIds: ["WORLD/201"],
            expectedPaths: ["World/world_icon.jpeg"],
        },
    ];

    static run(entry: IconInvalidImageReportsUndecodableIconCase): Promise<FindingSummary> {
        return WorldIconFixture.run(new IconInvalidImage(), entry);
    }
}
