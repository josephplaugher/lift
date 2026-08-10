import { useEffect, useRef, useState } from "react";
import useRestTimerSettings from "./useRestTimerSettings";
import { playRestCompleteTone } from "../utilities/playRestCompleteTone";

const AUTO_START_DELAY_MS = 4000;

function formatRestTime(totalSeconds: number) {
    const safe = Math.max(0, totalSeconds);
    const minutes = Math.floor(safe / 60);
    const seconds = safe % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function useRestTimer() {
    const { durationSeconds, autoStart, muteChime } = useRestTimerSettings();
    const [open, setOpen] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(durationSeconds);
    const autoStartTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const tickInterval = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
    const audioUnlocked = useRef(false);
    const muteChimeRef = useRef(muteChime);
    muteChimeRef.current = muteChime;

    function clearTimers() {
        clearTimeout(autoStartTimeout.current);
        clearInterval(tickInterval.current);
        autoStartTimeout.current = undefined;
        tickInterval.current = undefined;
    }

    function unlockAudio() {
        if (muteChimeRef.current) return;
        if (audioUnlocked.current) return;
        try {
            const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
            if (!AudioContextClass) return;
            const ctx = new AudioContextClass();
            void ctx.resume().then(() => {
                audioUnlocked.current = true;
                void ctx.close();
            });
        } catch {
            // ignore
        }
    }

    function startTimer() {
        unlockAudio();
        clearTimers();
        setSecondsLeft(durationSeconds);
        setOpen(true);
        tickInterval.current = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(tickInterval.current);
                    tickInterval.current = undefined;
                    if (!muteChimeRef.current) {
                        playRestCompleteTone();
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }

    function dismissTimer() {
        clearTimers();
        setOpen(false);
        setSecondsLeft(durationSeconds);
    }

    // After the user stops typing a set value, kick off the rest timer in auto mode.
    function onSetRepEntered(value: number | string) {
        if (!autoStart) return;
        if (open) return;

        unlockAudio();
        clearTimeout(autoStartTimeout.current);
        autoStartTimeout.current = undefined;

        if (!(Number(value) > 0)) return;

        autoStartTimeout.current = setTimeout(() => {
            startTimer();
        }, AUTO_START_DELAY_MS);
    }

    useEffect(() => () => clearTimers(), []);

    return {
        autoStart,
        durationSeconds,
        open,
        secondsLeft,
        displayTime: formatRestTime(secondsLeft),
        done: open && secondsLeft === 0,
        startTimer,
        dismissTimer,
        onSetRepEntered,
    };
}
