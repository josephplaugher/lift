export default function ConvertUnits(unit: string, value: number) {
    if(unit == "kg") return value;

    return Number(value * 2.204623).toFixed(0);
}