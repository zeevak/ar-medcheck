/**
 * audio-cues.js
 * Synthesizes auditory feedback using the Web Audio API with zero external
 * audio asset dependencies. Works around mobile browser autoplay restrictions
 * by creating or resuming an AudioContext lazily upon user interaction.
 */

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

// Unlock audio on initial user touch or click
window.addEventListener("touchstart", () => getAudioContext(), { once: true });
window.addEventListener("click", () => getAudioContext(), { once: true });

/**
 * Play a pleasant two-tone ascending chime (sine wave)
 * Used when a marker is detected or a shelf is placed with all drugs verified safe.
 */
function playSuccessChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = "sine";
    osc2.type = "sine";

    // E5 (659.25 Hz) transitioning to A5 (880.00 Hz)
    osc1.frequency.setValueAtTime(659.25, now);
    osc2.frequency.setValueAtTime(880.00, now + 0.12);

    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.exponentialRampToValueAtTime(0.2, now + 0.03);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    gainNode.gain.setValueAtTime(0.25, now + 0.12);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.12);

    osc2.start(now + 0.12);
    osc2.stop(now + 0.45);
  } catch (err) {
    console.warn("Audio chime error:", err);
  }
}

/**
 * Play a low, urgent double alert tone (sawtooth/square wave)
 * Used when one or more medications on a placed shelf have an active FDA recall.
 */
function playAlertChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = "sawtooth";
    osc2.type = "sawtooth";

    // Two rapid warning pulses: 349.23 Hz (F4) and 311.13 Hz (Eb4)
    osc1.frequency.setValueAtTime(349.23, now);
    osc2.frequency.setValueAtTime(311.13, now + 0.18);

    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.exponentialRampToValueAtTime(0.22, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

    gainNode.gain.setValueAtTime(0.22, now + 0.18);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.15);

    osc2.start(now + 0.18);
    osc2.stop(now + 0.40);
  } catch (err) {
    console.warn("Audio chime error:", err);
  }
}

// Expose globally for both A-Frame and Three.js scenes
window.playSuccessChime = playSuccessChime;
window.playAlertChime = playAlertChime;
