# UI refresh: five directions

A broad first pass at modernising the Stemn web app's look, for review. **Nothing here changes the app**: no component,
stylesheet or dependency in the app packages is touched, and this PR is not meant to merge as is.

## Reviewing

Open [`gallery/index.html`](./gallery/index.html) in a browser (it works from the file system, no server). To get it locally:

```sh
git fetch origin design/ui-refresh-directions
git worktree add ../stemn-ui-review design/ui-refresh-directions
xdg-open ../stemn-ui-review/design/ui-refresh/gallery/index.html
```

| View | What it is for |
| --- | --- |
| Overview | The five directions and today's UI, with the idea behind each |
| Components | One component in every direction, side by side, with **Keep**, **Drop** and a note on each |
| Screens | A whole screen in one direction, optionally beside another. Labelled areas jump to that component |
| Feedback | Your picks as text. **Copy feedback** and paste it to Claude or into a PR comment |

### Naming things

Every component has a stable id, and `<direction>-<component>` names one version of it:

- `B-C12` is the file list in direction B
- `0-C12` is the file list as it is today
- `P03` and `S01` are screens, so `D-P08` is the whole revision diff screen in direction D

The point is to mix: "nav from E (`E-C01`), tables from C (`C-C12`), buttons from A (`A-C05`)" is a useful answer. Picks
save in your browser as you go.

| | Direction | The idea |
| --- | --- | --- |
| A | Hairline | Monochrome, white, 1px lines. The most conservative step from today |
| B | Soft Studio | Borderless cards with soft shadows, a floating nav, segmented tabs, indigo |
| C | Blueprint | Square, ruled, monospaced metadata, signal orange. The most engineering-led |
| D | Graphite | Dark UI for a CAD-tool feel, azure accent |
| E | Workspace | A left sidebar instead of the top bar, warm paper tones, serif titles, green accent |

## How it is made

The screenshots are the real website against the local backend with seeded data. `capture.mjs` opens each screen, adds one
direction's stylesheet to the page and photographs it, recording where each component is so the gallery can crop it.

| Path | What it is |
| --- | --- |
| `catalog.mjs` | The directions, screens and components with their ids |
| `directions/_base.css` | The app's components restated in design tokens, by component id |
| `directions/{a..e}.css` | Each direction: its tokens, then what tokens cannot express |
| `capture.mjs` | Screenshots, component positions and the `--audit` contrast check |
| `gallery/` | The review page, its data (`manifest.js`) and the screenshots (`shots/`, `sheets/`) |

To regenerate, with the backend running (`stemn-backend`: `local/start.sh`, `local/seed.sh`):

```sh
STEMN_ENV=local npm run dev                  # in one terminal
node design/ui-refresh/capture.mjs           # all of it, about 15 minutes. --only=a,b and --page=P03,P07 narrow it
node design/ui-refresh/sheets.mjs            # the contact sheets
```

## What to keep in mind

- **These are style directions, not an implementation.** The stylesheets override the app's CSS from outside, with
  selectors that lean on generated class names. The final version would put tokens in `theme.module.css` and
  `theme-variables.css` and change the components themselves.
- **What the data shows is curated.** The local database's leftovers from e2e and desktop test runs are hidden from the page
  during capture (`clean` in `capture.mjs`; nothing is deleted). The capture also uploads a CAD revision pair to the seed project
  `Open Quadruped Robot`, once, so the viewer and diff screens have something to show. The History graph's counts (C26) are
  made up, because the seed has no activity in the graph's range and the API currently rejects its date filters.
- **Behaviour is not covered.** Hover, focus, transitions and small screens are not in the screenshots, and everything is
  at 1440 px wide. Direction E's sidebar in particular is a static layout here: it would need real responsive work.
- **Not covered:** the desktop (Electron) app, the marketing site, project settings, and the other file viewers (PDF, PCB,
  G-code, simulation). They come after the broad direction is picked.
