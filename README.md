# Cocos Layer View

A Chrome extension for debugging Cocos Creator games (2.x and 3.x) running in the browser.

It can:

- split the scene into 3D layers so you can see what is drawn on top of what,
- show the full node tree (like cc-inspector),
- edit Position / Rotation / Scale and turn nodes on or off,
- pause the game and run it one frame at a time.

Everything is in an **Anatomy** tab inside Chrome DevTools, so nothing covers the game screen.

> This is a modified version of the **Cocos Anatomy** extension from the Chrome Web Store (`dooemmeeahbfkfghniadkbabempkadji`, v0.1.0). The original work belongs to its author.

## Install

1. Download this repo (`Code` → `Download ZIP`, then unzip) or `git clone https://github.com/hmt64/cocos-layer-view.git`.
2. Open `chrome://extensions` in Chrome.
3. Turn on **Developer mode** (top right).
4. Click **Load unpacked** and choose the `cocos-layer-view` folder.
5. If you also have the original Cocos Anatomy installed, turn it off.

To update: pull or download again, then click the reload button on the extension card in `chrome://extensions`.

## Quick start

1. Open your game page (for example the Cocos preview at `http://localhost:7456`).
2. Press **F12** to open DevTools and go to the **Anatomy** tab.
   - If you do not see the tab, close DevTools and open it again.
3. If the tab says "Anatomy is not running on this page", click **Load Anatomy into the page**.
4. The node tree appears on the left. Click a node to edit it on the right.

## The Anatomy tab

### Toolbar

| Button | What it does |
|---|---|
| Layer view | Turn the 3D layer view on or off |
| ◂ Back | Go back to the parent layer level |
| ☝ Interact | Give the mouse and keyboard back to the game so you can play. Click again to return to the same layers |
| Hide 3D | Hide 3D cameras so only the 2D UI is shown |
| ⏸ Pause / ▶ Resume | Pause or resume the game logic (tweens, spine, `update()`). The screen still renders |
| ⏭ Step | Run one frame, then pause again |
| Spacing − / + / ↺ | Change the space between layers, or reset it |

### Node tree (left)

- **Layer view off:** the whole scene, in the same order as cc-inspector. Inactive nodes are grey and marked `inactive`.
- **Layer view on:**
  - Layers show a number. Click ▸ (or double-click) to split a layer into its child layers.
  - Nodes that are not layers are grey and italic, with a reason: `inactive`, `hidden` (a parent is inactive) or `no render` (nothing visible inside). You can still select them and open their children.
- The tree updates by itself when the game turns nodes on or off.

### Node editor (right)

- **Active**: turn the node on or off.
- **Position / Rotation / Scale**:
  - drag the X / Y / Z letters left or right,
  - or click a box and press ↑ / ↓ (Shift = ×10, Alt = ×0.1),
  - or scroll the mouse wheel on the focused box,
  - or type a number and press Enter.
- Changed values are highlighted in orange.
- **↺** resets one row, **Reset** resets the whole node.
- **Copy** copies the node transform as JSON. **All edits** copies every node you changed.

## Keyboard shortcuts

| Key | Action |
|---|---|
| `Alt+Shift+L` | Turn layer view on / off |
| `P` | Pause / resume |
| `.` | Step one frame |
| `I` | Interact with the game |
| `Esc` | Back / exit |
| `+` / `-` | Zoom |
| Arrow keys | Rotate the camera |
| `H` | Show / hide the hint line |

## Example: check a big win animation

1. Turn on **Layer view**, then click **☝ Interact** and play until the big win starts.
2. Press **P** to pause.
3. Click **▣ Back to layers**.
4. Open the node (for example `ShakeRoot > CutsceneControl > WinEffect`) and look at its layers.
5. Press **.** to move forward one frame at a time. Press **P** again to resume.

## Without DevTools

If DevTools is closed, the same controls show as small floating windows on the page. Click the extension icon or press `Alt+Shift+L` to start.

## Files

```
manifest.json
src/background.js      injects src/anatomy.js into the page (icon / shortcut)
src/anatomy.js         layer view + page API window.__cocosAnatomy (panelState, cmd)
devtools/devtools.js   creates the Anatomy tab
devtools/panel.*       the tab UI, talks to the page with chrome.devtools.inspectedWindow.eval
```

## Changelog

| Version | Changes |
|---|---|
| 0.1.1 – 0.1.5 | Transform editor, floating Transform window, Layers tree, layer spacing |
| 0.2.0 | 3D games: Hide 3D, Interact, Copy / All edits |
| 0.2.1 | Tree shows every node (inactive / no render), Active checkbox |
| 0.2.2 | Pause / Step, layers update in real time |
| 0.3.0 | Controls moved into the DevTools "Anatomy" tab, no floating windows while docked |
