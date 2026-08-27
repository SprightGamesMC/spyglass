import type { ContentModel } from "../../Types/ModelTypes.js";
import type { PathSubject } from "../../Types/PathSubjectTypes.js";

export default abstract class MeasuredPaths {
    static collect(model: ContentModel): PathSubject[] {
        const subjects: PathSubject[] = [];
        const seen = new Set<string>();

        for (const pack of model.packs) {
            for (const item of pack.items) {
                MeasuredPaths.add(subjects, seen, { path: item.path, measuredPath: item.packPath, pack: pack.root });
            }
        }

        for (const world of model.worlds) {
            for (const item of world.items) {
                MeasuredPaths.add(subjects, seen, { path: item.path, measuredPath: item.packPath, pack: world.root });
            }
        }

        for (const file of model.filesOutsidePacks) {
            MeasuredPaths.add(subjects, seen, { path: file.path, measuredPath: file.path });
        }

        return subjects;
    }

    private static add(subjects: PathSubject[], seen: Set<string>, subject: PathSubject): void {
        if (seen.has(subject.path)) {
            return;
        }

        seen.add(subject.path);
        subjects.push(subject);
    }
}
