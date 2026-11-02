import assert from "node:assert/strict";
import { test } from "node:test";
import UsageError from "../../src/Errors/UsageError.js";
import EmoteProjectStorageConvertsProjectToExportedFiles from "../Helpers/EmoteProjectStorageConvertsProjectToExportedFiles.js";

test("project is converted to the manifest, meta, animation, and lang files of the export", async () => {
    const result = await EmoteProjectStorageConvertsProjectToExportedFiles.convert(
        EmoteProjectStorageConvertsProjectToExportedFiles.project()
    );

    assert.deepEqual(result.paths, ["manifest.json", "em_spright_wave.meta.json", "em_spright_wave.animation.json", "texts/en_US.lang"]);
    assert.equal(result.meta.piece_name, "em_spright_wave");
    assert.equal(result.meta.piece_type, "persona_emote");
    assert.ok(result.lang.includes("persona.offer.title=Wave\n"));
    assert.ok(result.lang.includes("persona.emote.chat_message=@ does the &Wave&\n"));
});

test("model_identifier that already starts with em_ does not get a second prefix", async () => {
    const result = await EmoteProjectStorageConvertsProjectToExportedFiles.convert(
        EmoteProjectStorageConvertsProjectToExportedFiles.project({ model_identifier: "em_spright_wave" })
    );

    assert.equal(result.meta.piece_name, "em_spright_wave");
});

test("keyframes are sorted by time and empty axis values are 0", async () => {
    const bones = await EmoteProjectStorageConvertsProjectToExportedFiles.bones(
        EmoteProjectStorageConvertsProjectToExportedFiles.project(
            {},
            EmoteProjectStorageConvertsProjectToExportedFiles.animators("head", [
                EmoteProjectStorageConvertsProjectToExportedFiles.keyframe("rotation", 1, ["5", "", "0"]),
                EmoteProjectStorageConvertsProjectToExportedFiles.keyframe("rotation", 0, ["0", "0", "0"]),
            ])
        )
    );

    assert.deepEqual(bones.head, { rotation: { "0": ["0", "0", "0"], "1": ["5", 0, "0"] } });
});

test("catmullrom interpolation is exported as lerp_mode with a post value", async () => {
    const bones = await EmoteProjectStorageConvertsProjectToExportedFiles.bones(
        EmoteProjectStorageConvertsProjectToExportedFiles.project(
            {},
            EmoteProjectStorageConvertsProjectToExportedFiles.animators("head", [
                EmoteProjectStorageConvertsProjectToExportedFiles.keyframe("rotation", 0, [0, 0, 0], "catmullrom"),
            ])
        )
    );

    assert.deepEqual(bones.head, { rotation: { "0": { post: [0, 0, 0], lerp_mode: "catmullrom" } } });
});

test("keyframe after a step keyframe has the previous value as its pre value", async () => {
    const bones = await EmoteProjectStorageConvertsProjectToExportedFiles.bones(
        EmoteProjectStorageConvertsProjectToExportedFiles.project(
            {},
            EmoteProjectStorageConvertsProjectToExportedFiles.animators("head", [
                EmoteProjectStorageConvertsProjectToExportedFiles.keyframe("rotation", 0, [1, 1, 1], "step"),
                EmoteProjectStorageConvertsProjectToExportedFiles.keyframe("rotation", 1, [2, 2, 2]),
            ])
        )
    );

    assert.deepEqual(bones.head, { rotation: { "0": [1, 1, 1], "1": { pre: [1, 1, 1], post: [2, 2, 2] } } });
});

test("project in another model format is a usage error", () => {
    assert.throws(
        () =>
            EmoteProjectStorageConvertsProjectToExportedFiles.create(
                EmoteProjectStorageConvertsProjectToExportedFiles.project({ meta: { model_format: "bedrock" } })
            ),
        UsageError
    );
});

test("text that is not JSON is a usage error", () => {
    assert.throws(() => EmoteProjectStorageConvertsProjectToExportedFiles.create("{"), UsageError);
});

test("EMOTE/402 passes on a project with root at the origin", async () => {
    assert.deepEqual(
        await EmoteProjectStorageConvertsProjectToExportedFiles.findings(
            "root",
            EmoteProjectStorageConvertsProjectToExportedFiles.project()
        ),
        []
    );
});

test("EMOTE/402 reports a project with root Y 20", async () => {
    const findings = await EmoteProjectStorageConvertsProjectToExportedFiles.findings(
        "root",
        EmoteProjectStorageConvertsProjectToExportedFiles.project(
            {},
            EmoteProjectStorageConvertsProjectToExportedFiles.animators("root", [
                EmoteProjectStorageConvertsProjectToExportedFiles.keyframe("position", 0, ["0", "0", "0"]),
                EmoteProjectStorageConvertsProjectToExportedFiles.keyframe("position", 1, ["0", "20", "0"]),
                EmoteProjectStorageConvertsProjectToExportedFiles.keyframe("position", 2, ["0", "0", "0"]),
            ])
        )
    );

    assert.equal(findings.length, 2);
});

test("EMOTE/701 reports a project with loop set to loop, which the export removes", async () => {
    assert.equal(
        (
            await EmoteProjectStorageConvertsProjectToExportedFiles.findings(
                "loop",
                EmoteProjectStorageConvertsProjectToExportedFiles.project({}, { loop: "loop" })
            )
        ).length,
        1
    );
    assert.equal(
        (
            await EmoteProjectStorageConvertsProjectToExportedFiles.findings(
                "loop",
                EmoteProjectStorageConvertsProjectToExportedFiles.project()
            )
        ).length,
        0
    );
});

test("EMOTE/204 reports a project animator for a bone outside the allowed set, which the export removes", async () => {
    const findings = await EmoteProjectStorageConvertsProjectToExportedFiles.findings(
        "bone",
        EmoteProjectStorageConvertsProjectToExportedFiles.project(
            {},
            EmoteProjectStorageConvertsProjectToExportedFiles.animators("tail", [
                EmoteProjectStorageConvertsProjectToExportedFiles.keyframe("rotation", 0, [0, 0, 0]),
            ])
        )
    );

    assert.equal(findings.length, 1);
});

test("EMOTE/202 reports a project with no model_identifier because em_unknown has no studio prefix", async () => {
    assert.equal(
        (
            await EmoteProjectStorageConvertsProjectToExportedFiles.findings(
                "identifier",
                EmoteProjectStorageConvertsProjectToExportedFiles.project({ model_identifier: "" })
            )
        ).length,
        1
    );
});

test("EMOTE/213 reports a project chat message with no & characters", async () => {
    assert.equal(
        (
            await EmoteProjectStorageConvertsProjectToExportedFiles.findings(
                "highlight",
                EmoteProjectStorageConvertsProjectToExportedFiles.project({ persona_emote_chat_message: "@ waves" })
            )
        ).length,
        1
    );
});

test("EMOTE/211 reports a project root position with a Molang expression", async () => {
    const findings = await EmoteProjectStorageConvertsProjectToExportedFiles.findings(
        "numeric",
        EmoteProjectStorageConvertsProjectToExportedFiles.project(
            {},
            EmoteProjectStorageConvertsProjectToExportedFiles.animators("root", [
                EmoteProjectStorageConvertsProjectToExportedFiles.keyframe("position", 0, ["math.sin(1)", "0", "0"]),
            ])
        )
    );

    assert.equal(findings.length, 1);
});
