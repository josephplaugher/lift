import { FetchGet } from "../utilities/Fetch";

export type TPersonalRecordLookup = {
    liftName: string;
    weight: number;
} | null;

export default async function GetPersonalRecord(token: string, liftName: string): Promise<TPersonalRecordLookup> {
    const path = `pr/${encodeURIComponent(liftName.replace(/ /g, "_"))}`;
    const response = await FetchGet(path, token);
    if (!response.ok) {
        throw new Error("Error fetching personal record");
    }
    return await response.json();
}
