/** Short double-beep for rest complete. Needs a prior user gesture to unlock audio. */
export function playRestCompleteTone() {
    try {
        const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextClass) return;

        const ctx = new AudioContextClass();
        const playBeep = (startAt: number, frequency: number) => {
            const oscillator = ctx.createOscillator();
            const gain = ctx.createGain();
            oscillator.type = "sine";
            oscillator.frequency.value = frequency;
            gain.gain.setValueAtTime(0.0001, startAt);
            gain.gain.exponentialRampToValueAtTime(0.2, startAt + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.22);
            oscillator.connect(gain);
            gain.connect(ctx.destination);
            oscillator.start(startAt);
            oscillator.stop(startAt + 0.25);
        };

        void ctx.resume().then(() => {
            const now = ctx.currentTime;
            playBeep(now, 880);
            playBeep(now + 0.28, 1175);
            setTimeout(() => void ctx.close(), 800);
        });
    } catch {
        // Audio is best-effort; ignore environments that block it.
    }
}
