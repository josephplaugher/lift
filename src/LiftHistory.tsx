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
            <tr key={l.Id} id={l.Id} className="d-flex justify-content-between my-2">
                <td>{l.Date}</td>
                <td>{l.Name}</td>
                <td>{l.Weight}</td>
                <td>{l.Set1 && l.Set1}</td>
                <td>{l.Set2 && l.Set2}</td>
                <td>{l.Set3 && l.Set3}</td>
                <td>{l.Set4 && l.Set4}</td>
                <td>{l.Set5 && l.Set5}</td>
            </tr>
        </small>
    )

    return (
        <div className="container-fluid py-0 px-2" style={{ height: "90vh" }}>
            <div className="row overflow-auto h-100 p-2">
                {lifts.length > 0 && (
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Lift</th>
                                <th>KG</th>
                                <th>Sets</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lifts.map((l: ILift) =>
                                <tr key={l.Id} id={l.Id}>
                                    <td>{l.Date}</td>
                                    <td>{l.Name}</td>
                                    <td>{l.Weight}</td>
                                    <td>{l.Set1 && l.Set1},
                                        {l.Set2 && l.Set2},
                                        {l.Set3 && l.Set3},
                                        {l.Set4 && l.Set4},
                                        {l.Set5 && l.Set5}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}