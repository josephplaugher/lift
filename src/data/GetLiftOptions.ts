import ApiUrl from "../ApiUrl";

export default async function GetLiftOptions(): Promise<any> {
    const response: any = await fetch(`${ApiUrl()}/api/liftoption`, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    })
    return await response.json();
}