import type { CheckDefinition, CheckGroup } from "../Types/CheckTypes.js";

export default abstract class CheckIds {
    static readonly SEPARATOR = "/";

    static of(definition: CheckDefinition): string {
        return CheckIds.format(definition.group, definition.number);
    }

    static compare(left: string, right: string): number {
        const leftParsed = CheckIds.parse(left);
        const rightParsed = CheckIds.parse(right);

        if (leftParsed === undefined || rightParsed === undefined) {
            return left.localeCompare(right);
        }

        if (leftParsed.group !== rightParsed.group) {
            return leftParsed.group.localeCompare(rightParsed.group);
        }

        return leftParsed.number - rightParsed.number;
    }

    static groupOf(id: string): string {
        return CheckIds.parse(id)?.group ?? id;
    }

    static numberOf(id: string): number | undefined {
        return CheckIds.parse(id)?.number;
    }

    private static format(group: CheckGroup, number: number): string {
        return group + CheckIds.SEPARATOR + number;
    }

    private static parse(id: string): { group: string; number: number } | undefined {
        const match = /^([A-Z]+)\/(\d+)$/.exec(id);

        if (match === null) {
            return undefined;
        }

        return { group: match[1], number: Number(match[2]) };
    }
}
