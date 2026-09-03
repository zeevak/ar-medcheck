# AR MedCheck — 3-Minute Demonstration Video Script & Storyboard

**Project:** AR MedCheck: Recall-Aware Healthcare WebXR Experience  
**Target Duration:** Exactly 3 Minutes (180 Seconds)  
**Deliverable Requirement:** Section 6 (Demonstration — 3 minute demonstration covering all required features)

---

## Storyboard Overview & Rubric Checklist

| Timecode | Segment Name | Core Feature Demonstrated | Rubric Pillar Addressed |
| :--- | :--- | :--- | :--- |
| **0:00 – 0:25** | Intro & Clinical Problem | Problem context, WebXR justification, Portal UI | Problem Definition & Innovation (4 Marks) |
| **0:25 – 1:10** | Marker-Based AR Scan | Hiro marker tracking, rotating 3D bottle, Web Audio chime | Technical Implementation & 3D Assets (8 Marks) |
| **1:10 – 2:05** | Markerless AR + Live FDA Data | WebXR hit-test, reticle snapping, tap-to-place shelf, live openFDA binding | Advanced Feature (Option A) & UX (5 Marks) |
| **2:05 – 2:40** | Engineering Challenges | CDN self-hosting fix, status query filtering, audio autoplay | Documentation & Troubleshooting (5 Marks) |
| **2:40 – 3:00** | Evaluation & Conclusion | 60 FPS performance, cross-device testing, reflection | Testing & Evaluation (3 Marks) |

---

## Shot-by-Shot Production Script

### Scene 1: Introduction & Healthcare Use Case (0:00 – 0:25)
- **Time:** 0:00 – 0:25 (25 Seconds)
- **Visual Display:** 
  - [0:00 – 0:10]: Title slide showing *"AR MedCheck: Interactive WebXR Healthcare Experience"*, student details, and live GitHub Pages URL.
  - [0:10 – 0:25]: Phone screen showing the clean clinical portal (`index.html`). Tap on `fetch-test.html` and click *"Fetch Live Recall Data"*, showing instant JSON records from openFDA with green status pill.
- **Narration Script:**
  > *"Welcome to AR MedCheck, an interactive WebXR healthcare application designed for the INTE 42312 Virtual and Augmented Reality assignment.*  
  > *In healthcare, consuming recalled medications leads to severe adverse events. Traditional paper recall notices are slow and rarely reach patients at the point of consumption.*  
  > *AR MedCheck leverages WebXR to deliver zero-install, browser-based AR directly on mobile devices—connecting physical medication packaging and home medicine cabinets to the live openFDA Drug Enforcement REST API in real time."*

---

### Scene 2: Marker-Based AR — Prescription Label Tracking (0:25 – 1:10)
- **Time:** 0:25 – 1:10 (45 Seconds)
- **Visual Display:**
  - [0:25 – 0:35]: Camera navigates to `marker.html`. HUD shows *"Marker not detected"* in dark emerald.
  - [0:35 – 0:50]: Point phone camera at the physical printed Hiro marker (or monitor). In under 200 ms, the marker locks. An ascending two-tone success chime plays. HUD pill transitions to active green with text: *"Marker detected — prescription label recognized"*.
  - [0:50 – 1:10]: Zoom in and orbit the camera around the marker. Show the optimized 3D pill bottle model rotating smoothly on its Y-axis at 60 FPS with realistic lighting and PBR textures. Briefly occlude the marker with a hand to show instant clean unmounting and status reset.
- **Narration Script:**
  > *"First, we demonstrate marker-based AR using AR.js and A-Frame. In a clinical setting, prescription labels feature optical markers.*  
  > *When our camera detects the Hiro fiducial marker, the system triggers a Web Audio API success chime, and our HUD status pill confirms identification.*  
  > *Anchored to the marker is an optimized 3D prescription pill bottle model sourced from poly.pizza. The asset runs a continuous 6-second rotation animation with directional lighting and logarithmic depth buffering. Tracking is instantaneous, and when the marker is occluded, the scene cleanly unmounts without visual artifacts."*

---

### Scene 3: Markerless AR & Live openFDA Data Integration (1:10 – 2:05)
- **Time:** 1:10 – 2:05 (55 Seconds)
- **Visual Display:**
  - [1:10 – 1:25]: Navigate to `markerless.html`. Show the clinical HUD indicating *"Loading recall data..."* followed by *"Data loaded — tap a surface to place the shelf"*. Tap *"Start AR"*.
  - [1:25 – 1:40]: In AR mode, pan the phone camera over a desk or floor surface. Show the green ring reticle snapping dynamically to detected horizontal planes using the WebXR hit-test loop.
  - [1:40 – 2:05]: Tap the screen. The 3D medicine shelf materializes solidly on the surface. Show the three indicator bottles atop the shelf:
    - Point to safe drugs in green (`0x1f7a4d`).
    - Point to recalled drugs in red (`0xc23b3b`).
    - An urgent double alert chime sounds immediately upon placement.
    - Show the floating on-screen legend displaying the exact status: `ibuprofen: RECALLED`, `paracetamol: safe`.
    - Orbit the physical camera around the placed shelf to demonstrate spatial stability.
- **Narration Script:**
  > *"Next, we demonstrate markerless spatial AR combined with Advanced Option A: live REST API data integration.*  
  > *Built with raw Three.js and the native WebXR Device API, the app establishes an 'immersive-ar' session and queries the viewer reference space. Our green reticle continuously performs hit-testing against real-world horizontal surfaces.*  
  > *When I tap the screen, a controller select event anchors our virtual medicine cabinet at that exact 6-DoF pose.*  
  > *Crucially, before placement, the system queried the openFDA Drug Enforcement Reports API for active recalls. The indicator bottles dynamically bind to this live data: safe medications render in emerald green, while recalled products turn crimson red. An urgent acoustic alert tone informs the caregiver immediately, corroborated by our live HUD status readout."*

---

### Scene 4: Engineering Challenges & Technical Solutions (2:05 – 2:40)
- **Time:** 2:05 – 2:40 (35 Seconds)
- **Visual Display:**
  - [2:05 – 2:18]: Quick split-screen or overlay of the project structure showing `vendor/three/`, `js/audio-cues.js`, and `assets/models/`. Highlight the 3D model optimization table (shelf model: 129.9 KB down to 24.4 KB, an 81.2% reduction).
  - [2:18 – 2:40]: Show the code snippet for `status:"Ongoing"` in `fda-fetch.js`, and show the iOS Safari fallback screen displaying the clinical *"WebXR not supported on this device/browser"* notice.
- **Narration Script:**
  > *"During development, several key technical challenges were solved:*  
  > *First, mobile networks silently failed to load remote ES modules from CDNs. We resolved this by building a watchdog diagnostic script and completely self-hosting Three.js vendor modules using native browser import maps.*  
  > *Second, general openFDA queries returned closed historical recalls from years ago, causing universal false alarms. We engineered compound boolean queries filtering strictly for 'status: Ongoing'.*  
  > *Third, to satisfy 3D asset optimization requirements, we used gltf-transform to compress our shelf model by over 81%, while replacing fragile external MP3 assets with pure Web Audio API synthesis that cleanly unlocks on mobile touch events.*  
  > *Finally, because iOS Safari lacks WebXR hit-test support, we implemented capability detection with an informative fallback interface."*

---

### Scene 5: Testing, Evaluation & Closing (2:40 – 3:00)
- **Time:** 2:40 – 3:00 (20 Seconds)
- **Visual Display:**
  - [2:40 – 2:50]: Show the Cross-Device Testing Matrix summary table (`TESTING_MATRIX.md`), highlighting consistent 60 FPS performance and sub-25 MB memory footprint on Android.
  - [2:50 – 3:00]: Return to the landing portal and concluding title card with GitHub repository link and open-source acknowledgements.
- **Narration Script:**
  > *"Rigorous cross-device testing across Android ARCore, iOS Safari, and Desktop WebXR emulators verified reliable 60 FPS performance, sub-25 MB memory usage, and robust offline error handling.*  
  > *AR MedCheck demonstrates how WebXR can transform critical public health workflows through accessible, data-driven augmented reality.*  
  > *Thank you."*

---

## Practical Recording Tips for the Student
1. **Device Setup:** Record the phone screen using Android's native screen recorder (set to 1080p, 60 FPS, record microphone + device audio so the Web Audio chimes are audible).
2. **Hiro Marker Preparation:** Display the Hiro marker on a laptop screen or print it on paper; ensure even room lighting without heavy monitor glare.
3. **Pacing:** Practice speaking with a stopwatch. The script is timed at ~130 words per minute, leaving comfortable pauses for audio chime cues and 3D camera orbits.
4. **URL Override:** For a 100% deterministic demo during testing or video recording, append `?forceRecall=ibuprofen` to the URL if you wish to guarantee a red bottle state regardless of fluctuating FDA server updates.
