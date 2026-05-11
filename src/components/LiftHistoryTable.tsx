import { SetStateAction } from "react";
import ILift from "../interfaces/ILift.interface";
import { EUnits } from "../interfaces/IUnits.enum";
import ConvertUnits from "../utilities/ConvertUnits";

export default function LiftHistoryTable(param: { lifts: ILift[], units: EUnits, setSelectedSet?: React.Dispatch<SetStateAction<ILift>> }) {
    return (
        <>
            <table className="table" data-testid="lift-history-table" style={{fontSize: "0.75rem"}}>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Lift</th>
                        <th>{param.units == EUnits.Kg ? "Kg" : "Lbs"}</th>
                        <th>Sets</th>
                    </tr>
                </thead>
                <tbody>
                    {param.lifts.length > 0 ? (
                        <>
                            {param.lifts.map((l: ILift) =>
                                <tr key={l.Id} id={l.Id} onClick={()=> param.setSelectedSet && param.setSelectedSet(l)}>
                                    <td>{l.Date.split("T")[0]}</td>
                                    <td>{l.Name}</td>
                                    <td>{ConvertUnits(param.units, l.Weight)}</td>
                                    <td>{l.Set1 && l.Set1},
                                        {l.Set2 && l.Set2},
                                        {l.Set3 && l.Set3},
                                        {l.Set4 && l.Set4},
                                        {l.Set5 && l.Set5}</td>
                                </tr>
                            )}
                        </>
                    ) : (
                        <tr><td colSpan={4}>Nothing here</td></tr>
                    )}
                </tbody>
            </table>
        </>
    )
}