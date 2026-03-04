import ILiftOption from "../interfaces/LiftOptions.interfaces";
import ApiUrl from "../utilities/ApiUrl";

export default async function GetLiftOptions(token: string): Promise<ILiftOption[]> {
    console.trace('liftoption fetch get');
    const response = await fetch(`${ApiUrl()}/api/liftoption`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    })
    return await response.json();
}