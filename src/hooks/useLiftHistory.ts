import { Dispatch, SetStateAction, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toPng } from "html-to-image";
import { ILiftGraphable } from "../interfaces/ILift.interface";
import { EUnits } from "../interfaces/IUnits.enum";
import { GetLiftHistoryGrouped } from "../data/GetLiftHistory";
import GetPersonalRecord, { TPersonalRecordLookup } from "../data/GetPersonalRecord";
import useGetToken from "./useGetToken";
import ConvertUnits from "../utilities/ConvertUnits";

const DEFAULT_RANGE_DAYS = 366;

function daysAgoIsoDate(days: number) {
    return new Date(new Date().setDate(new Date().getDate() - days)).toISOString().split("T")[0];
}

function todayIsoDate() {
    return new Date().toISOString().split("T")[0];
}

function slugifyLiftName(name: string) {
    return name.trim().toLowerCase().replace(/\s+/g, "-") || "lift";
}

function dataUrlToFile(dataUrl: string, filename: string) {
    const [header, data] = dataUrl.split(",");
    const mime = header.match(/:(.*?);/)?.[1] ?? "image/png";
    const binary = atob(data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return new File([bytes], filename, { type: mime });
}

function downloadDataUrl(dataUrl: string, filename: string) {
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
}

export default function useLiftHistory(
    name: string,
    units: EUnits,
    setUnits: Dispatch<SetStateAction<EUnits>>,
) {
    const token = useGetToken();
    const shareRef = useRef<HTMLDivElement>(null);
    const [startDate, setStartDate] = useState<string>(daysAgoIsoDate(DEFAULT_RANGE_DAYS));
    const [endDate, setEndDate] = useState<string>(todayIsoDate());
    const [sharing, setSharing] = useState(false);
    const [shareError, setShareError] = useState<string | null>(null);
    const chartHeight = Math.round(window.innerHeight * 0.50);

    const historyQuery = useQuery<ILiftGraphable[]>({
        enabled: token != "",
        queryKey: ["liftHistoryGrouped", name, startDate, endDate],
        queryFn: () => GetLiftHistoryGrouped(token, name, startDate, endDate),
        select: (data: ILiftGraphable[]) => data.map((row: ILiftGraphable) => ({
            Date: row.Date,
            Load: units === EUnits.Lbs ? ConvertUnits(units, Number(row.Load)) : Number(row.Load) as number,
            Lift: row.Lift,
        })) as ILiftGraphable[],
    });

    const prQuery = useQuery<TPersonalRecordLookup>({
        enabled: token != "" && name != "",
        queryKey: ["personalRecord", name],
        queryFn: () => GetPersonalRecord(token, name),
    });

    function resetDateRange() {
        setStartDate(daysAgoIsoDate(DEFAULT_RANGE_DAYS));
        setEndDate(todayIsoDate());
    }

    function toggleUnits() {
        setUnits((prev) => prev === EUnits.Kg ? EUnits.Lbs : EUnits.Kg);
    }

    async function shareProgress() {
        if (!shareRef.current || sharing) return;
        setSharing(true);
        setShareError(null);
        const filename = `lift-progress-${slugifyLiftName(name)}.png`;
        const card = shareRef.current;
        const title = document.createElement("h3");
        title.className = "progress-share-title text-lift text-center mb-3";
        title.textContent = name;
        card.prepend(title);
        let dataUrl: string;
        try {
            // Let layout settle before snapshotting SVG chart nodes.
            await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
            dataUrl = await toPng(card, {
                cacheBust: true,
                pixelRatio: 2,
                backgroundColor: "#ffffff",
                filter: (node) => {
                    if (!(node instanceof Element)) return true;
                    return !node.hasAttribute("data-share-exclude");
                },
            });
        } catch (error: any) {
            title.remove();
            console.error("Share progress failed", error);
            setShareError("Could not share that image. Try again.");
            setSharing(false);
            return;
        }

        // Drop the temporary title before the share sheet opens so it doesn't
        // flash back onto the Progress view while the dialog is up.
        title.remove();

        try {
            const file = dataUrlToFile(dataUrl, filename);
            const shareData: ShareData = {
                files: [file],
                title: `${name} progress`,
                text: prQuery.data
                    ? `My ${name} personal record: ${ConvertUnits(units, prQuery.data.weight)} ${units}`
                    : `My ${name} progress on Lift!`,
            };

            if (navigator.canShare?.({ files: [file] })) {
                await navigator.share(shareData);
            } else {
                downloadDataUrl(dataUrl, filename);
            }
        } catch (error: any) {
            // User canceling the share sheet is not an app error.
            if (error?.name === "AbortError") return;
            console.error("Share progress failed", error);
            setShareError("Could not share that image. Try again.");
        } finally {
            setSharing(false);
        }
    }

    const personalRecord = prQuery.data
        ? {
            displayWeight: ConvertUnits(units, prQuery.data.weight),
            units,
        }
        : null;

    const canShare = Boolean(historyQuery.data?.length || personalRecord);

    return {
        name,
        units,
        chartHeight,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        historyQuery,
        personalRecord,
        shareRef,
        sharing,
        shareError,
        canShare,
        shareProgress,
        resetDateRange,
        toggleUnits,
        formatWeight: (weight: number) => ConvertUnits(units, weight),
    };
}
