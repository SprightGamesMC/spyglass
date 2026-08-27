#!/usr/bin/env node
import process from "node:process";
import Main from "./Main.js";

export default abstract class Cli {
    static async main(): Promise<void> {
        const io = {
            writeOut: (text: string): void => {
                process.stdout.write(text);
            },
            writeError: (text: string): void => {
                process.stderr.write(text);
            },
            isTerminal: process.stdout.isTTY === true,
            isErrorTerminal: process.stderr.isTTY === true,
        };

        process.exitCode = await Main.run(process.argv.slice(2), io, process.cwd(), process.env);
    }
}

await Cli.main();
