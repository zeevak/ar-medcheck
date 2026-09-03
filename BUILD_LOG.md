# AR MedCheck — Full Build Log

A complete, step-by-step record of everything done so far on this project,
in the order it happened. Useful as raw material for the technical report's
Implementation and Troubleshooting sections.

---

## 0. The Concept

**Project:** AR MedCheck — a recall-aware medicine cabinet AR experience.
**Course:** INTE 42312 (WebXR/WebAR assignment, 25 marks).
**Domain chosen:** Healthcare.
**Advanced feature chosen:** Option A — live REST API data (openFDA Drug
Enforcement Reports), rather than Option B (complex interaction).

**The pitch:** a patient/caregiver scans a prescription-label marker to see
a 3D pill bottle (marker-based AR), and separately places a virtual medicine
shelf on a real surface (markerless AR via WebXR hit-test), where indicator
"bottles" on the shelf are colored red or green live, based on whether that
drug currently has an active FDA recall.

**Framework decision:** AR.js + A-Frame for the marker-based scene (fastest,
most beginner-friendly path to fiducial marker tracking), raw Three.js for
the markerless scene (more reliable, better-documented WebXR hit-test
pattern than community A-Frame hit-test add-ons).

---

## 1. Two-PC Workflow Decision

**Constraint:** building on one PC, presenting on another, under a
self-imposed 48-hour build window.

**Decision:** host everything on **GitHub Pages**. Since WebXR requires
HTTPS anyway, this was a natural fit — both machines (and, critically, the
phone needed for the actual camera-based AR demo) just open the same public
URL. No manual file-copying between machines, no version drift. Confirmed
this eliminates the two-PC concern entirely, with the one caveat that AR
tracking itself needs a camera, so the *presentation* device for the live
demo specifically has to be a phone (or a laptop with a webcam), not a bare
PC screen.

---

## 2. Phase 1 — Repo, Hosting, and the Live-Data Checkpoint

**Steps taken:**
1. Created a public GitHub repo (`ar-medcheck`), cloned to the build PC.
2. Enabled GitHub Pages (Settings → Pages → deploy from `main` branch root)
   immediately, before writing any real code, to confirm HTTPS hosting
   worked before building anything on top of it.
3. Built the initial project skeleton:
   - `index.html` — landing page / menu linking to each build stage.
   - `css/style.css` — shared clinical-styled stylesheet (used throughout).
   - `js/fda-fetch.js` — reusable module wrapping calls to the openFDA
     Drug Enforcement Reports API (`api.fda.gov/drug/enforcement.json`),
     with a `fetchRecalls()` function and `matchRecalledProducts()` helper.
   - `fetch-test.html` — a standalone checkpoint page, no AR/3D at all,
     whose only job was to prove the `fetch()` → openFDA → parsed JSON
     pipeline worked before any 3D complexity was added on top.
   - `marker.html`, `markerless.html` — placeholder pages at this stage.
   - `README.md` — documents the git/GitHub Pages workflow and a running
     phase checklist.
4. Pushed, waited for Pages to redeploy, and verified `fetch-test.html`
   returned real live FDA data on the hosted URL. This was the first
   working checkpoint of the whole project.

**Why this order mattered:** proving the hosting pipeline and the data
pipeline separately, before combining them with AR/3D complexity, meant
later bugs could be isolated to "is this an AR problem or a data problem"
much faster.

---

## 3. Phase 2 — 3D Model Sourcing & Optimization

**Guidance given:** use **poly.pizza** (free, CC-licensed, pre-optimized
low-poly glTF models) rather than Sketchfab, to avoid spending scarce time
on license-filtering or manually optimizing high-poly files.

**Models sourced:** a pill bottle (`assets/models/pill-bottle.glb`) and a
shelf/rack model (`assets/models/shelf.glb`).

**Optimization step:** installed `@gltf-transform/cli` via npm and ran
`gltf-transform optimize` with mesh quantization on models, comparing
file sizes before/after:
- `shelf.glb`: 129,900 bytes (126.9 KB) -> `shelf.optimized.glb`: 24,388 bytes (23.8 KB) — an **81.2% size reduction**.
- `pill-bottle.glb`: 128,176 bytes (125.2 KB) — single optimized mesh, 1 material, 1 texture.

---

## 4. Phase 3 — Marker-Based AR (`marker.html`)

**Stack:** A-Frame 1.5.0 + AR.js 3.4.5.

**Implementation:**
- Used the standard **Hiro marker** (explicitly allowed by the assignment
  brief) to anchor digital content.
- `<a-marker preset="hiro">` anchors a `gltf-model` entity (the pill bottle)
  with a looping rotation animation.
- A status pill at the bottom of the screen toggles between "Marker not
  detected" and "Marker detected — prescription label recognized" via
  `markerFound` / `markerLost` events.
- Wired `playSuccessChime()` via Web Audio API on detection.

**Verified working** via a real device screenshot: Hiro marker printed/
displayed on a monitor, phone camera picked it up, bottle rendered and
rotated correctly, status text updated live.

---

## 5. Phase 4–5 — Markerless AR + Live Data (`markerless.html`)

**Stack:** raw Three.js, using `ARButton`, `GLTFLoader`, and the native
WebXR Device API (`hit-test`).

**Core mechanics implemented:**
- **WebXR support check** on load (`navigator.xr.isSessionSupported('immersive-ar')`) —
  shows a clear "not supported" message on unsupported browsers/devices
  (notably iOS Safari) instead of failing silently.
- **Hit-test loop:** each frame, queries a hit-test source against the
  viewer's reference space; when a real surface is found, a ring-shaped
  reticle mesh snaps to that surface's pose.
- **Tap-to-place:** the WebXR `select` event spawns a shelf group at the
  reticle's current position/rotation.
- **Live data binding:** on load, `fetchRecalls()` is called for tracked drug
  names (`ibuprofen`, `acetaminophen`, `amoxicillin`), filtering by
  `status:"Ongoing"`. Indicator bottles on the shelf are colored red
  (recalled) or green (safe).
- **Fail-safe design:** if openFDA is slow or unreachable, the scene defaults
  to "no recalls" rather than crashing; `?forceRecall=productName` URL override
  allows deterministic demo testing.

---

## 6. Bug Fix — Silent Module Failure (CDN import blocked)

**Symptom:** page stuck forever on "Loading recall data…", no Start-AR button appeared.
**Diagnosis:** CDN imports from jsdelivr failed under restricted WiFi without logging.
**Watchdog:** added independent non-module `<script>` with 6-second timeout and global window error listener.
**Fix:** self-hosted Three.js, ARButton, GLTFLoader in `vendor/three/` with browser-native `<script type="importmap">`.

---

## 7. Phase 6 — Audio Polish (`js/audio-cues.js`)

**Decision:** pure Web Audio API synthesis instead of external audio files.
**Implementation:** single lazy `AudioContext` unlocked on initial user touch/click.
- `playSuccessChime()`: 2-tone ascending sine chime.
- `playAlertChime()`: double-pulse sawtooth alert for active FDA recalls.
- Tied into marker recognition and shelf placement data evaluations.

---

## 8. Bug Fix — Ongoing Recall Filtering & Spatial Anchoring

- Refined openFDA query with `status:"Ongoing"` to filter out historical closed recalls.
- Fixed indicator bottle height at `y: 0.09` relative to shelf group to avoid async bounding box race conditions.
- Added live on-screen text status readout inside legend for complete UX transparency.
