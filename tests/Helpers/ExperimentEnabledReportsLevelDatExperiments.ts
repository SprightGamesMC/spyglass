import type { Finding } from "../../src/Types/CheckTypes.js";
import type { ExperimentCase } from "../Types/ExperimentEnabledReportsLevelDatExperimentsTypes.js";
import ExperimentEnabled from "../../src/Checks/World/ExperimentEnabled.js";
import ModelFixture from "./Core/ModelFixture.js";
import NbtWriter from "./World/NbtWriter.js";

export default abstract class ExperimentEnabledReportsLevelDatExperiments {
    static readonly ID = "WORLD/701";
    static readonly CASES: readonly ExperimentCase[] = [
        {
            name: "level.dat without an experiments compound has no experiment enabled",
            entries: [NbtWriter.string("LevelName", "Test")],
            expectFinding: false,
        },
        {
            name: "experiments compound with every flag 0 has no experiment enabled",
            entries: [
                NbtWriter.compound("experiments", [
                    NbtWriter.byte("gametest", 0),
                    NbtWriter.byte("experiments_ever_used", 0),
                    NbtWriter.byte("saved_with_toggled_experiments", 0),
                ]),
            ],
            expectFinding: false,
        },
        {
            name: "saved_with_toggled_experiments 1 alone is not an enabled experiment",
            entries: [NbtWriter.compound("experiments", [NbtWriter.byte("saved_with_toggled_experiments", 1)])],
            expectFinding: false,
        },
        {
            name: "data_driven_items 1 is an enabled experiment",
            entries: [NbtWriter.compound("experiments", [NbtWriter.byte("data_driven_items", 1)])],
            expectFinding: true,
            expectedText: "data_driven_items",
        },
        {
            name: "experiments_ever_used 1 means an experiment was enabled",
            entries: [NbtWriter.compound("experiments", [NbtWriter.byte("experiments_ever_used", 1)])],
            expectFinding: true,
            expectedText: "experiments_ever_used",
        },
        {
            name: "legacy experimentalgameplay 1 means an experiment was enabled",
            entries: [NbtWriter.byte("experimentalgameplay", 1)],
            expectFinding: true,
            expectedText: "experimentalgameplay",
        },
    ];

    static async run(entry: ExperimentCase): Promise<Finding[]> {
        const files = { "World/level.dat": NbtWriter.levelDat(entry.entries), "World/levelname.txt": "Test" };

        return ModelFixture.findings(new ExperimentEnabled(), files, { contentType: "world" });
    }
}
