import type { TextReadResult } from "../../src/Types/LoaderTypes.js";
import type { TextReadCase } from "../Types/TextLoaderReportsUnreadableFileAsStatusTypes.js";
import JsonLoader from "../../src/Loaders/JsonLoader.js";
import TextLoader from "../../src/Loaders/TextLoader.js";
import MemoryStorage from "./Core/MemoryStorage.js";

export default abstract class TextLoaderReportsUnreadableFileAsStatus {
    static readonly PATH = "BP/functions/start.mcfunction";
    static readonly CONTENT = JsonLoader.BYTE_ORDER_MARK + "say hello\nsay again";
    static readonly CASES: readonly TextReadCase[] = [
        {
            name: "functions/start.mcfunction with a byte order mark reads ok with the mark removed",
            path: TextLoaderReportsUnreadableFileAsStatus.PATH,
            unreadable: false,
            expectedStatus: "ok",
            expectedLines: ["say hello", "say again"],
        },
        {
            name: "functions/start.mcfunction whose bytes cannot be read is unreadable with an error",
            path: TextLoaderReportsUnreadableFileAsStatus.PATH,
            unreadable: true,
            expectedStatus: "unreadable",
            expectedLines: undefined,
        },
    ];

    static loader(unreadable: boolean): TextLoader {
        const storage = new MemoryStorage({
            [TextLoaderReportsUnreadableFileAsStatus.PATH]: TextLoaderReportsUnreadableFileAsStatus.CONTENT,
        });

        if (unreadable) {
            storage.addUnreadable(TextLoaderReportsUnreadableFileAsStatus.PATH);
        }

        return new TextLoader(storage);
    }

    static read(testCase: TextReadCase): Promise<TextReadResult> {
        return TextLoaderReportsUnreadableFileAsStatus.loader(testCase.unreadable).read(testCase.path);
    }

    static readLines(testCase: TextReadCase): Promise<string[] | undefined> {
        return TextLoaderReportsUnreadableFileAsStatus.loader(testCase.unreadable).readLines(testCase.path);
    }
}
