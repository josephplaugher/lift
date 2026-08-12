import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isIos() {
    return /iphone|ipad|ipod/i.test(navigator.userAgent)
        || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

function isStandalone() {
    return window.matchMedia("(display-mode: standalone)").matches
        || ("standalone" in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
}

export default function useInstallPrompt() {
    const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
    const [installed, setInstalled] = useState(isStandalone());
    const ios = isIos();

    useEffect(() => {
        const onPrompt = (event: Event) => {
            event.preventDefault();
            setInstallEvent(event as BeforeInstallPromptEvent);
        };
        const onInstalled = () => {
            setInstalled(true);
            setInstallEvent(null);
        };
        window.addEventListener("beforeinstallprompt", onPrompt);
        window.addEventListener("appinstalled", onInstalled);
        return () => {
            window.removeEventListener("beforeinstallprompt", onPrompt);
            window.removeEventListener("appinstalled", onInstalled);
        };
    }, []);

    async function install() {
        if (!installEvent) return;
        await installEvent.prompt();
        const choice = await installEvent.userChoice;
        if (choice.outcome === "accepted") {
            setInstalled(true);
        }
        setInstallEvent(null);
    }

    return {
        installed,
        ios,
        canInstall: Boolean(installEvent) && !installed,
        showIosHint: ios && !installed,
        install,
    };
}
