export default class ToolError extends Error {
    static describe(error: unknown): string {
        return error instanceof Error ? error.message : String(error);
    }

    constructor(message: string, cause?: unknown) {
        super(message, { cause });
        this.name = "ToolError";
    }
}
