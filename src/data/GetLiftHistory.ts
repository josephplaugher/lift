import { FetchGet } from "../utilities/Fetch";

 
export default async function GetLiftHistory(token: string, liftName: string | undefined = ""): Promise<any> {
    const path = liftName ? `lift/${liftName?.replace(" ", "_")}` : "/api/lift";
    const response = await FetchGet(`${path}`, token)
    return await response.json()
}