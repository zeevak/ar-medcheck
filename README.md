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
index.html          Landing page / menu
fetch-test.html      Phase 1 checkpoint: live openFDA data, no AR
marker.html           Phase 3: marker-based AR scene (placeholder)
markerless.html        Phase 4–5: markerless AR + live data (placeholder)
js/fda-fetch.js         Reusable openFDA fetch + recall-matching logic
css/style.css            Shared styling
assets/models/           glTF/GLB 3D models go here
assets/markers/           Marker pattern images go here
```

## Status
- [x] Phase 1: Repo, GitHub Pages hosting, live FDA fetch checkpoint
- [ ] Phase 2: Optimized 3D models (glTF) added to assets/models — download from poly.pizza, run gltf-transform, screenshot the file-size before/after for the report
- [x] Phase 3: Marker-based AR (AR.js) scene built on marker.html — works with fallback primitives now, swap in pill-bottle.glb when ready
- [x] Phase 4: Markerless AR (WebXR hit-test) working on markerless.html — Android Chrome only, iOS not supported (documented limitation)
- [x] Phase 5: Live FDA data driving bottle color state (green = no recall, red = recall match)
- [ ] Phase 6: UI polish, animation, lighting, audio
- [ ] Phase 7: Cross-device testing
- [ ] Phase 8: Report + demo recording
