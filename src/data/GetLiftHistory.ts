import ApiUrl from "../ApiUrl";

export default async function GetLiftHistory(liftName: string | undefined = ""): Promise<any> {
    const path = liftName ? `/api/lift/${liftName?.replace(" ", "_")}` : "/api/lift";
    const response = await fetch(`${ApiUrl()}${path}`, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    })
    return await response.json()
}