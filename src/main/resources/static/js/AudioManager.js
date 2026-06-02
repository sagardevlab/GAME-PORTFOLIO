/**
 * AudioManager.js
 * Pure Web Audio API retro 8-bit sound engine — no external files needed.
 */
const AudioManager = (() => {

    let ctx = null;
    let muted = false;
    let masterGain = null;

    function init() {
        try {
            ctx = new (window.AudioContext || window.webkitAudioContext)();
            masterGain = ctx.createGain();
            masterGain.gain.value = 0.35;
            masterGain.connect(ctx.destination);
        } catch(e) { console.warn('AudioContext not available'); }
    }

    function resume() {
        if (ctx && ctx.state === 'suspended') ctx.resume();
    }

    function beep(freq = 440, type = 'square', duration = 0.08, vol = 0.4) {
        if (!ctx || muted) return;
        resume();
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(masterGain);
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(vol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);
    }

    function chord(freqs, type = 'square', duration = 0.12) {
        freqs.forEach((f, i) => {
            setTimeout(() => beep(f, type, duration, 0.3), i * 40);
        });
    }

    const sounds = {
        step:    () => beep(120, 'square', 0.05, 0.2),
        jump:    () => { beep(200, 'square', 0.06); setTimeout(() => beep(350, 'square', 0.08), 60); },
        land:    () => beep(80, 'square', 0.07, 0.3),
        enter:   () => chord([262, 330, 392, 523], 'square', 0.12),
        exit:    () => chord([523, 392, 330, 262], 'square', 0.08),
        hover:   () => beep(440, 'square', 0.04, 0.15),
        select:  () => chord([392, 494, 587], 'sine', 0.15),
        success: () => chord([523, 659, 784, 1047], 'sine', 0.2),
        error:   () => { beep(200, 'sawtooth', 0.1); setTimeout(() => beep(150, 'sawtooth', 0.15), 100); },
        coin:    () => { beep(988, 'square', 0.06); setTimeout(() => beep(1319, 'square', 0.1), 60); },
        powerup: () => {
            const freqs = [261, 329, 392, 523, 659, 784];
            freqs.forEach((f, i) => setTimeout(() => beep(f, 'square', 0.08, 0.3), i * 50));
        }
    };

    function play(name) {
        if (sounds[name]) sounds[name]();
    }

    function toggleMute() {
        muted = !muted;
        if (masterGain) masterGain.gain.value = muted ? 0 : 0.35;
        return muted;
    }

    return { init, play, toggleMute, isMuted: () => muted };
})();
