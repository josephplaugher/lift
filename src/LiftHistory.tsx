import { useEffect, useState } from "react";
import ApiUrl from "./ApiUrl";
import ILift from "./interfaces/ILift.interface";

export default function LiftHistory() {
    const [lifts, setLifts] = useState<ILift[]>([]);

    useEffect(() => {
        getLifts()
    }, [])
    async function getLifts() {
        const response: any = await fetch(`${ApiUrl()}/api/lift`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        })
        const responseData: any = await response.json();
        setLifts(responseData)
        console.log("options ", responseData)
    }

    const l = lifts.length > 0 && lifts.map((l: ILift) =>
        <small>
            <div key={l.Id} id={l.Id} className="d-flex justify-content-between my-2">
                <div>{l.Date}</div>
                <div>{l.Name}</div>
                <div>{l.Weight}</div>
                <div>{l.Set1 && l.Set1}</div>
                <div>{l.Set2 && l.Set2}</div>
                <div>{l.Set3 && l.Set3}</div>
                <div>{l.Set4 && l.Set4}</div>
                <div>{l.Set5 && l.Set5}</div>
            </div>
        </small>
    )

    return (
        <div className="container-fluid py-0 px-2" style={{ height: "80vh" }}>
            <div className="row overflow-scroll">
                {l}
            </div>
        </div>
    )
}