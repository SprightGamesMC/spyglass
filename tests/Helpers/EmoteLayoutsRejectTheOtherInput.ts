import type {
    EmoteLayoutsRejectTheOtherInputCase,
    EmoteLayoutsRejectTheOtherInputResult,
} from "../Types/EmoteLayoutsRejectTheOtherInputTypes.js";
import path from "node:path";
import CliRunner from "./Core/CliRunner.js";

export default abstract class EmoteLayoutsRejectTheOtherInput {
    private static readonly TEST_FOLDER = "EmoteLayoutsRejectTheOtherInput";
    private static readonly USAGE_EXIT_CODE = 2;
    private static readonly PROJECT_FILE = "em_sample_wave.bbmodel";
    static readonly CASES: readonly EmoteLayoutsRejectTheOtherInputCase[] = [
        {
            name: "exported emote pack under the standard layout is a usage error",
            scenario: "emote-marketplace",
            arguments: ["check", "persona"],
            expectedExitCode: EmoteLayoutsRejectTheOtherInput.USAGE_EXIT_CODE,
            expectedError: "--layout marketplace",
        },
        {
            name: ".bbmodel input under the marketplace layout is a usage error",
            scenario: "emote",
            projectFile: EmoteLayoutsRejectTheOtherInput.PROJECT_FILE,
            arguments: ["check", "persona", "--layout", "marketplace"],
            expectedExitCode: EmoteLayoutsRejectTheOtherInput.USAGE_EXIT_CODE,
            expectedError: "standard layout",
        },
        {
            name: ".bbmodel input with the addon content type is a usage error",
            scenario: "emote",
            projectFile: EmoteLayoutsRejectTheOtherInput.PROJECT_FILE,
            arguments: ["check", "addon"],
            expectedExitCode: EmoteLayoutsRejectTheOtherInput.USAGE_EXIT_CODE,
            expectedError: "persona content type",
        },
        {
            name: ".bbmodel input under the standard layout runs and reports findings",
            scenario: "emote",
            projectFile: EmoteLayoutsRejectTheOtherInput.PROJECT_FILE,
            arguments: ["check", "persona"],
            expectedExitCode: 1,
        },
        {
            name: "exported emote pack under the marketplace layout runs and reports findings",
            scenario: "emote-marketplace",
            arguments: ["check", "persona", "--layout", "marketplace"],
            expectedExitCode: 1,
        },
    ];

    static run(entry: EmoteLayoutsRejectTheOtherInputCase): EmoteLayoutsRejectTheOtherInputResult {
        const folder = CliRunner.prepareScenarioInput(entry.scenario, EmoteLayoutsRejectTheOtherInput.TEST_FOLDER);
        const input = entry.projectFile === undefined ? folder : path.join(folder, entry.projectFile);
        const result = CliRunner.run([...entry.arguments, "--input", input]);

        return { exitCode: result.exitCode, stderr: result.stderr };
    }
}
