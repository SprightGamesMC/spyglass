# EMOTE

An emote pack, meaning a persona pack whose meta `piece_type` is `persona_emote`: the emote meta file, the animation file it lists, and the emote strings in `en_US.lang`. Rules about the pack body itself are in [PERSONA](persona.md).

Runs for: persona. Only packs whose meta `piece_type` is `persona_emote`. The marketplace layout reads the exported pack. The standard layout reads a `.bbmodel` file converted to the files the export writes, so checks of file names and of the exported format cannot fail there. See [Layouts](../layouts.md#emote).

## Summary

| ID | Slug | Severity | Description |
|---|---|---|---|
| EMOTE/101 | animation-source-missing | error | Meta has no animation_sources entry |
| EMOTE/102 | chat-message-missing | error | No persona.emote.chat_message key in en_US.lang |
| EMOTE/103 | easter-egg-missing | error | No persona.emote.easter_egg key in en_US.lang |
| EMOTE/104 | title-missing | error | No persona.offer.title key in en_US.lang |
| EMOTE/105 | edge-keyframe-missing | warning | Keyframed channel has no keyframe at time 0 or at the animation end |
| EMOTE/201 | animation-file-name-invalid | error | animationFile is not <id>.animation.json |
| EMOTE/202 | identifier-invalid | error | Identifier is not lower case letters, digits, underscore, starting with em_ and containing a studio prefix |
| EMOTE/203 | animation-name-mismatch | error | animation_sources name is not animation.<id> or is not a key in the animation file |
| EMOTE/204 | bone-not-allowed | error | Animation moves a bone that is not in the allowed set |
| EMOTE/205 | hold-on-last-frame-used | error | Animation loop is hold_on_last_frame |
| EMOTE/206 | animation-time-query-used | error | Animation uses query.anim_time or q.anim_time |
| EMOTE/207 | start-pose-not-neutral | error | First keyframe has rotation, position, or scale away from neutral |
| EMOTE/208 | end-pose-not-neutral | error | Last keyframe has rotation, position, or scale away from neutral |
| EMOTE/209 | piece-sources-present | error | Emote meta has texture_sources or geometry_sources |
| EMOTE/210 | chat-message-no-player-token | warning | Chat message or easter egg has no @ player token |
| EMOTE/211 | limited-channel-value-not-numeric | error | Root position or bone scale has a component that is not a number |
| EMOTE/212 | channel-value-not-numeric | warning | Rotation or non root position has a component that is not a number |
| EMOTE/213 | chat-highlight-invalid | warning | Chat message or easter egg has no pair of & characters, or an odd number |
| EMOTE/214 | keyframe-not-on-frame | warning | Keyframe time is not within 0.0005 seconds of a multiple of 1/24 second |
| EMOTE/215 | animation-length-not-on-frame | warning | Animation length is not within 0.0005 seconds of a multiple of 1/24 second |
| EMOTE/301 | animation-file-not-found | error | animationFile refers to a file not in the pack |
| EMOTE/401 | animation-too-long | error | Animation is longer than 10 seconds |
| EMOTE/402 | root-movement-over-limit | error | Root moves above 16 on Y, below 0 on Y, or beyond plus or minus 4 on X or Z |
| EMOTE/403 | bone-scale-over-limit | error | Bone scale is outside 0.85 to 1.15 or not uniform |
| EMOTE/404 | root-landing-offset | error | Root reaches Y 0 from above with X or Z away from 0 |
| EMOTE/501 | animation-format-version-invalid | error | Animation file format_version is not 1.8.0 |
| EMOTE/601 | multiple-animations | error | Animation file defines more than one animation |
| EMOTE/701 | loop-enabled | error | Animation has a loop key set to true |
| EMOTE/702 | scaled-child-of-scaled-parent | error | Bone has scale away from 1 while an ancestor bone also has scale away from 1 |

`<id>` below is the emote identifier, the `piece_name` value. The meta file name is checked by PERSONA/203, which also runs for emote packs.

## Definitions

- Vector: a channel value or keyframe value with 3 components. A single value is the same value on all 3 components. A string that contains a decimal number, such as `"1.5"`, is a number.
- Keyframed channel: a channel whose value is an object with times as keys. A channel whose value is one vector has no keyframes.
- Animation end: the larger of `animation_length` and the last keyframe time.
- Sampling: for each pair of adjacent keyframes, values are evaluated from the `post` value of the first keyframe to the `pre` value of the second. Samples are at both keyframe times and at every multiple of 1/24 second between them. Times after 3600 seconds are not sampled, and EMOTE/401 reports those animations.
- Interpolation: linear by default. A segment is catmullrom when either of its keyframes has `lerp_mode` `catmullrom`, the same as the preview in Blockbench. The outer control points are the neighbor keyframes. At the first and last keyframe, and at a keyframe with different `pre` and `post` values, the end keyframe is repeated as the outer control point.
- Tolerance: sampled values between keyframes have a tolerance of `0.001`. Keyframe values have no tolerance.
- A segment with a vector that is not numeric at a keyframe or an outer control point is not sampled. EMOTE/211 and EMOTE/212 report that vector.

## EMOTE/101 animation-source-missing

The emote meta file has no `animation_sources` entry, so the game has no animation to play.

Fix: add an `animation_sources` entry that refers to the emote animation.

## EMOTE/102 chat-message-missing

`en_US.lang` has no `persona.emote.chat_message` key, the text shown in chat when the emote plays.

Fix: add a `persona.emote.chat_message` line.

## EMOTE/103 easter-egg-missing

`en_US.lang` has no `persona.emote.easter_egg` key.

Fix: add a `persona.emote.easter_egg` line.

## EMOTE/104 title-missing

`en_US.lang` has no `persona.offer.title` key, the display name of the emote.

Fix: add a `persona.offer.title` line.

## EMOTE/105 edge-keyframe-missing

A keyframed channel has no keyframe at time `0` or no keyframe at the animation end. A keyframe within `0.0005` seconds of that time counts.

Fix: add the missing keyframe.

## EMOTE/201 animation-file-name-invalid

The `animationFile` value is not `<id>.animation.json`. Some released first party emotes use `<id>.json`, which is still reported.

Fix: rename the animation file to `<id>.animation.json` and set `animationFile` to the same name.

## EMOTE/202 identifier-invalid

`piece_name` must use only lower case letters, digits, and underscore, must start with `em_`, and must contain another underscore after `em_` separating the studio prefix from the name. Both parts must be non empty. The `em_` prefix is added by the persona export in Blockbench.

Fix: set `piece_name` to `em_<studio>_<name>`.

## EMOTE/203 animation-name-mismatch

The name in `animation_sources` is not `animation.<id>`, or that name is not a key in the `animations` object of the animation file.

Fix: set the name to `animation.<id>` and define an animation with that exact key.

## EMOTE/204 bone-not-allowed

The animation moves a bone outside the allowed set: `root`, `hip`, `body`, `head`, `rightArm`, `leftArm`, `rightLeg`, `leftLeg`, `rightItem`, `leftItem`.

Fix: remove or rename the bone in the animation file.

## EMOTE/205 hold-on-last-frame-used

The animation `loop` value is `hold_on_last_frame`. An emote must return the player to the neutral pose when it ends.

Fix: remove the `loop` key or set another value.

## EMOTE/206 animation-time-query-used

The animation file uses `query.anim_time` or `q.anim_time`. The match ignores case.

Fix: replace those expressions with fixed keyframe values.

## EMOTE/207 start-pose-not-neutral

The first keyframe of a bone is not neutral. Neutral is rotation `0 0 0`, position `0 0 0` on every bone, and scale `1`. Values are read from the first keyframe of each channel after sorting keyframes by time.

Fix: set the first rotation, position, and scale keyframes to the neutral values.

## EMOTE/208 end-pose-not-neutral

The last keyframe of a bone is not neutral. Neutral is rotation `0 0 0`, position `0 0 0` on every bone, and scale `1`. Values are read from the last keyframe of each channel after sorting keyframes by time.

Fix: set the last rotation, position, and scale keyframes to the neutral values.

## EMOTE/209 piece-sources-present

The emote meta file contains `texture_sources` or `geometry_sources`. Those keys are for persona pieces.

Fix: remove both keys from the emote meta file.

## EMOTE/210 chat-message-no-player-token

`persona.emote.chat_message` or `persona.emote.easter_egg` has no `@` token, which is replaced by the player name.

Fix: add `@` where the player name should appear.

## EMOTE/211 limited-channel-value-not-numeric

A vector in a `root` position channel or in a scale channel of any bone has a component that is not a number, such as a Molang expression. EMOTE/402 and EMOTE/403 cannot prove the limits for that value.

Fix: replace the component with a number.

## EMOTE/212 channel-value-not-numeric

A vector in a rotation channel, or in a position channel of a bone other than `root`, has a component that is not a number. The numeric checks skip that value.

Fix: replace the component with a number.

## EMOTE/213 chat-highlight-invalid

`persona.emote.chat_message` or `persona.emote.easter_egg` has no `&` character, or has an odd number of them. A pair of `&` characters marks the highlighted text.

Fix: put `&` before and after the highlighted text.

## EMOTE/214 keyframe-not-on-frame

A keyframe time is more than `0.0005` seconds away from every multiple of 1/24 second.

Fix: move the keyframe to a frame at 24 frames per second.

## EMOTE/215 animation-length-not-on-frame

`animation_length` is more than `0.0005` seconds away from every multiple of 1/24 second. An animation without `animation_length` is not reported, because its length is the time of the last keyframe, which EMOTE/214 checks.

Fix: set the animation length to a frame at 24 frames per second.

## EMOTE/301 animation-file-not-found

The file named by `animationFile` is not in the pack.

Fix: add the animation file, or correct the `animationFile` value.

## EMOTE/401 animation-too-long

The animation end is after 10 seconds, so a keyframe after `animation_length` counts.

Fix: shorten the animation and update `animation_length` to match.

## EMOTE/402 root-movement-over-limit

A sampled `root` position goes above `16` or below `0` on Y, or beyond plus or minus `4` on X or Z. Each segment reports its first failing time. A `pre` value on the first keyframe and a `post` value on the last keyframe are also read.

Fix: adjust the `root` position keyframes to stay inside those limits.

## EMOTE/403 bone-scale-over-limit

A bone scale keyframe is not uniform on all three axes, or a sampled scale value is outside `0.85` to `1.15`. Each segment reports its first failing time.

Fix: use the same value on X, Y, and Z, inside that range.

## EMOTE/404 root-landing-offset

Sampled root Y goes from above `0` to `0`, and X or Z is not `0` at that time. Horizontal movement inside the EMOTE/402 limits while Y stays `0` is allowed.

Fix: set root X and Z to `0` at the time root Y reaches `0`.

## EMOTE/501 animation-format-version-invalid

The `format_version` of the animation file is not `1.8.0`.

Fix: set `format_version` to `1.8.0`.

## EMOTE/601 multiple-animations

The `animations` object has more than one key. The file must define exactly one animation.

Fix: remove the extra animations.

## EMOTE/701 loop-enabled

The animation has a `loop` key set to `true`. The persona export in Blockbench removes `loop`.

Fix: remove the `loop` key, or set it to `false`.

## EMOTE/702 scaled-child-of-scaled-parent

A bone has a scale other than `1 1 1` at any keyframe or sample, and one of its ancestor bones also has one at any time in the animation. The animation file does not contain the hierarchy, so it is fixed data from the emote format in Blockbench:

```
root
  hip
    body
      head
      leftArm
        leftItem
      rightArm
        rightItem
  leftLeg
  rightLeg
```

`leftLeg` and `rightLeg` are children of `root`, not of `hip`.

Fix: scale only the ancestor bone, or only the descendant bone.
