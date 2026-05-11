import ILiftOption from "../interfaces/LiftOptions.interfaces";
import { FetchGet } from "../utilities/Fetch";

export default async function GetLiftOptions(token: string): Promise<ILiftOption[]> {
    const response = await FetchGet(`liftoption`, token)
    return await response.json();
}