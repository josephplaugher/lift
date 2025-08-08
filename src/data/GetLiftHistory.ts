import ApiUrl from "../ApiUrl";

export default async function GetLiftsByName(liftName: string): Promise<any> {
    const response = await fetch(`${ApiUrl()}/api/lift/${liftName.replace(" ", "_")}`, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    })
    return await response.json()
}