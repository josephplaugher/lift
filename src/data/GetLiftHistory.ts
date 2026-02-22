import ApiUrl from "../utilities/ApiUrl";

 
export default async function GetLiftHistory(token: string, liftName: string | undefined = ""): Promise<any> {
    const path = liftName ? `/api/lift/${liftName?.replace(" ", "_")}` : "/api/lift";
    const response = await fetch(`${ApiUrl()}${path}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    })
    return await response.json()
}