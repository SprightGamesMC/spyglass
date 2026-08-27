import type { CliOptions } from "../../src/Types/CliTypes.js";
import type { SkipCase } from "../Types/ArgumentParserParsesSelectorsAndOptionsTypes.js";
import ArgumentParser from "../../src/Cli/ArgumentParser.js";

export default abstract class ArgumentParserParsesSelectorsAndOptions {
    static readonly SKIP_CASES: readonly SkipCase[] = [
        { text: "TEXTURE", expected: { group: "TEXTURE" } },
        { text: "TEXTURE/401", expected: { group: "TEXTURE", numbers: [401] } },
        { text: "TEXTURE/401,402,403", expected: { group: "TEXTURE", numbers: [401, 402, 403] } },
        { text: "TEXTURE/400-499", expected: { group: "TEXTURE", from: 400, to: 499 } },
        { text: "texture/401" },
        { text: "TEXTURE/abc" },
    ];

    static parse(argv: readonly string[]): CliOptions {
        return ArgumentParser.parse(argv);
    }

    static parseSkipOrUndefined(text: string): unknown {
        try {
            return ArgumentParser.parseSkip(text);
        } catch {
            return undefined;
        }
    }

    static parseThrows(argv: readonly string[]): boolean {
        try {
            ArgumentParser.parse(argv);

            return false;
        } catch {
            return true;
        }
    }
}
