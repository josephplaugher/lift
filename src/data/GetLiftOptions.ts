import ILiftOption from "../interfaces/LiftOptions.interfaces";
import ApiUrl from "../utilities/ApiUrl";

export default async function GetLiftOptions(): Promise<ILiftOption[]> {
    const response = await fetch(`${ApiUrl()}/api/liftoption`, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    })
    return await response.json();
}