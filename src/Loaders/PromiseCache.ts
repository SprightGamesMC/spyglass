export default class PromiseCache<T> {
    private readonly entries = new Map<string, Promise<T>>();

    get(key: string, load: () => Promise<T>): Promise<T> {
        const cached = this.entries.get(key);

        if (cached !== undefined) {
            return cached;
        }

        const pending = load();

        this.entries.set(key, pending);

        return pending;
    }
}
