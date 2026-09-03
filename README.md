# AR MedCheck — Recall-Aware Medicine Cabinet

WebXR/WebAR assignment (INTE 42312). Uses live openFDA drug recall data to
flag 3D pill bottles in AR.

## Two-PC Workflow (build machine + presentation phone/PC)

Because this is hosted on GitHub Pages, both machines just need a browser —
no files need to be copied manually.

**On the build PC:**
```bash
git add .
git commit -m "describe what changed"
git push
```
Wait ~30–60s for GitHub Pages to redeploy, then open:
`https://YOUR_USERNAME.github.io/ar-medcheck/`

**On the presentation device (should include a phone for the camera-based
AR demo):**
Just open the same URL. Always hard-refresh (or open in a private/incognito
tab) right before presenting, so you're not looking at a cached old build.

## Local preview while building (optional but recommended)

Opening `index.html` directly via `file://` will break `fetch()` calls in
some browsers due to CORS/security rules. Instead run a tiny local server:

```bash
# Python 3 (usually preinstalled)
python3 -m http.server 8000
# then visit http://localhost:8000
```
or, if you have Node:
```bash
npx serve .
```

## Project structure

```
index.html          Landing page / clinical portal menu
fetch-test.html      Phase 1 checkpoint: live openFDA data, no AR
marker.html           Phase 3: marker-based AR scene (AR.js + A-Frame, Hiro marker)
markerless.html        Phase 4–5: markerless AR (Three.js WebXR hit-test) + live data
TECHNICAL_REPORT.md   Phase 8: 4-page technical report (problem, design, implementation, challenges)
TESTING_MATRIX.md     Phase 7: cross-device testing matrix & performance evaluation
DEMO_SCRIPT.md        Phase 8: 3-minute demonstration video script & storyboard
BUILD_LOG.md          Full incremental build log & engineering decisions
js/fda-fetch.js         Reusable openFDA fetch + status-filtered recall logic
js/audio-cues.js        Synthesized Web Audio API sound generator (success/alert chimes)
css/style.css            Shared clinical aesthetic styling
vendor/three/           Self-hosted Three.js + ARButton + GLTFLoader
assets/models/           Optimized glTF/GLB models (pill-bottle.glb, shelf.glb)
```

## Status Checklist
- [x] Phase 1: Repo, GitHub Pages hosting, live FDA fetch checkpoint
- [x] Phase 2: Sourced & optimized 3D models (glTF/GLB via `@gltf-transform`, 81.2% reduction on shelf)
- [x] Phase 3: Marker-based AR working (`marker.html` with AR.js + A-Frame, Hiro marker tracking, rotating bottle, audio chime)
- [x] Phase 4: Markerless AR (`markerless.html` with native Three.js WebXR Device API hit-test, surface reticle, tap-to-place)
- [x] Phase 5: Live REST API data integration (openFDA `status:"Ongoing"` per-product recall flags, dynamic red/green indicators, live status readout)
- [x] Phase 6: UI polish, lighting, and synthetic Web Audio API feedback (success chime vs urgent recall alert)
- [x] Phase 7: Cross-device testing matrix (Android Chrome ARCore, iOS Safari fallback, Desktop WebXR Emulator, Webcam)
- [x] Phase 8: 4-page academic technical report & 3-minute demonstration video script/storyboard

