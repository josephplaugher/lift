import { useCallback, useState } from "react";

const STORAGE_KEY = "lift.restTimerSettings";
const DEFAULT_DURATION_SECONDS = 90;
const DEFAULT_AUTO_START = true;
const DEFAULT_MUTE_CHIME = false;

export type TRestTimerSettings = {
    durationSeconds: number;
    autoStart: boolean;
    muteChime: boolean;
};

function readSettings(): TRestTimerSettings {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return {
                durationSeconds: DEFAULT_DURATION_SECONDS,
                autoStart: DEFAULT_AUTO_START,
                muteChime: DEFAULT_MUTE_CHIME,
            };
        }
        const parsed = JSON.parse(raw) as Partial<TRestTimerSettings>;
        const duration = Number(parsed.durationSeconds);
        return {
            durationSeconds: Number.isFinite(duration) && duration > 0
                ? Math.floor(duration)
                : DEFAULT_DURATION_SECONDS,
            autoStart: typeof parsed.autoStart === "boolean" ? parsed.autoStart : DEFAULT_AUTO_START,
            muteChime: typeof parsed.muteChime === "boolean" ? parsed.muteChime : DEFAULT_MUTE_CHIME,
        };
    } catch {
        return {
            durationSeconds: DEFAULT_DURATION_SECONDS,
            autoStart: DEFAULT_AUTO_START,
            muteChime: DEFAULT_MUTE_CHIME,
        };
    }
}

function writeSettings(settings: TRestTimerSettings) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export default function useRestTimerSettings() {
    const [settings, setSettings] = useState<TRestTimerSettings>(readSettings);

    const setDurationSeconds = useCallback((durationSeconds: number) => {
        if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) return;
        setSettings((prev) => {
            const next = {
                ...prev,
                durationSeconds: Math.floor(durationSeconds),
            };
            writeSettings(next);
            return next;
        });
    }, []);

    const setAutoStart = useCallback((autoStart: boolean) => {
        setSettings((prev) => {
            const next = { ...prev, autoStart };
            writeSettings(next);
            return next;
        });
    }, []);

    const setMuteChime = useCallback((muteChime: boolean) => {
        setSettings((prev) => {
            const next = { ...prev, muteChime };
            writeSettings(next);
            return next;
        });
    }, []);

    return {
        durationSeconds: settings.durationSeconds,
        autoStart: settings.autoStart,
        muteChime: settings.muteChime,
        setDurationSeconds,
        setAutoStart,
        setMuteChime,
    };
}
