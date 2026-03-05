import { FetchGet } from "../utilities/Fetch";


export default async function GetLiftHistory(token: string, liftName: string | undefined = ""): Promise<any> {
    const path = liftName ? `lift/${liftName?.replace(" ", "_")}` : "lift";
    const response = await FetchGet(`${path}`, token)
    if (response.ok) {
        return await response.json()
    } else {
        throw new Error("Error fetching lift history")
    }
}