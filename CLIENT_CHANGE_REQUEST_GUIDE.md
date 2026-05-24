# Client Change Request Guide

Use this guide when you want Ali, Codex, or Claude to change the Hush UI.

## The Fastest Way To Request A Change

1. Open `Hush_Elegant_Product_Design_V2_editable.svg` in Lunacy, Sketch, or Inkscape.
2. Zoom into the part you care about.
3. Take a screenshot.
4. Mark the area if helpful.
5. Write one short instruction.

Example:

> On the `App - Permission Recovery` screen, make the red microphone icon look more like a real mic.

## Good Feedback Examples

- “Remove this item.”
- “This belongs in the app, not the keyboard.”
- “Rename this label to `Retry`.”
- “Make this button less prominent.”
- “This screen is too busy; simplify it.”
- “Move this concept to Settings.”
- “The keyboard should only show fast actions here.”

## Product Rules To Preserve

### Keyboard UI

The keyboard side should only include:

- Typing keys.
- Mic start/stop.
- Recording status.
- Live transcript/current transcript.
- Recent retry for failed saved audio.
- Tiny link to open Hush app when setup or detail work is needed.

### App UI

The app side should own:

- Welcome/setup.
- Microphone permission.
- Keyboard setup guide.
- Full history.
- Audio detail/retry/delete.
- Settings.
- Language and accuracy.
- Dictionary/words.
- Diagnostics/logs.
- Recovery/storage/support.

## What Not To Do

- Do not put Settings inside the keyboard UI.
- Do not put Dictionary inside the keyboard UI.
- Do not put Diagnostics inside the keyboard UI.
- Do not make the keyboard feel like a mini app.
- Do not show full history on the keyboard.

## Best Message To Send To Codex Or Claude

```text
Please update the Hush UI design in this repo.

Change:
[describe the exact change]

Reference:
[attach screenshot or mention screen name]

Keep the product rule:
- Keyboard UI is only for immediate dictation/insertion.
- App UI owns settings, history, dictionary, diagnostics, recovery, and setup.
```
