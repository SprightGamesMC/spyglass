export default class UsageError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "UsageError";
    }
}
