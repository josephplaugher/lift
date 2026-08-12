export default function ConvertUnits(unit: string, value: number) {
    if(unit == "kg") return value;

    return Number(value * 2.204623).toFixed(0);
}

/** Convert a displayed weight back to the kg value stored in the API. */
export function ToStoredKg(unit: string, displayedWeight: number) {
    if (!Number.isFinite(displayedWeight)) return 0;
    if (unit == "kg") return displayedWeight;
    return Math.round(displayedWeight / 2.204623);
}