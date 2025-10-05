import ILift from "../interfaces/ILift.interface";
import LiftHistoryTable from "../components/LiftHistoryTable";
import { useQuery } from "@tanstack/react-query";
import GetLiftHistory from "../data/GetLiftHistory";
import { ErrorIndicator, LoadingIndicator } from "../components/StatusIndicators";
import ILiftOption from "../interfaces/LiftOptions.interfaces";
import GetLiftOptions from "../data/GetLiftOptions";
import { useState } from "react";
import ProgressChart from "../components/ProgressChart";

export default function LiftHistory() {
    const [Name, setName] = useState<string>("Deadlift");
    const liftOptionsQuery = useQuery<ILiftOption[]>({ queryKey: ['liftOptions'], queryFn: GetLiftOptions })
    const liftHistoryQuery = useQuery<ILift[]>({ queryKey: ['liftHistory', Name], queryFn: () => GetLiftHistory(Name) })

    return (
        <>
            <div className="container-fluid py-0 px-0" style={{ height: "90vh" }} data-testid="lift-history">
                <div className="row overflow-auto h-50 p-2">
                    {liftHistoryQuery.status === 'pending' ? (
                        <LoadingIndicator />
                    ) : liftHistoryQuery.status === 'error' ? (
                        <ErrorIndicator error={liftHistoryQuery.error.message} />
                    ) : (
                        <ProgressChart lifts={liftHistoryQuery.data} name={Name}/>
                    )}
                </div>
            </div>
            <div className="container-fluid py-3 border border-4 border-primary" style={{ bottom: "0", position: "absolute" }} data-testid="lift-history-select">
                <div className="row pb-3" >
                    <div className="col">
                        <select onChange={(e) => setName(e.target.value)}
                            className={`form-control ${liftOptionsQuery.status == "pending" ? "bg-warning" : liftOptionsQuery.status == "error" ? "text-danger" : ""}`}>
                            {liftOptionsQuery.status === 'pending' ? (
                                <option value="">Getting lift options...</option>
                            ) : liftOptionsQuery.status === 'error' ? (
                                <option value="">Something went wrong...</option>
                            ) : (
                                liftOptionsQuery.data.map((l: ILiftOption) =>
                                    <option key={l.Id} id={l.Id} value={l.Name}>{l.Name}</option>
                                )
                            )}
                        </select>
                    </div>
                </div>
            </div>
        </>
    )
}