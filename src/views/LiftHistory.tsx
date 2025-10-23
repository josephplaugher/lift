import ILift from "../interfaces/ILift.interface";
import LiftHistoryTable from "../components/LiftHistoryTable";
import { useQuery } from "@tanstack/react-query";
import GetLiftHistory from "../data/GetLiftHistory";
import { ErrorIndicator, LoadingIndicator } from "../components/StatusIndicators";
import { useState } from "react";
import { EUnits } from "../interfaces/IUnits.enum";

export default function LiftHistory() {
    const [units, setUnits] = useState<EUnits>(EUnits.Kg);

    const liftHistoryQuery = useQuery<ILift[]>({ queryKey: ['liftHistory', "all"], queryFn: () => GetLiftHistory() })

    return (
        <div className="container-fluid py-0 px-2" style={{ height: "90vh" }} data-testid="lift-history">
            <button className="toggle-btn btn btn-secondary p-2" onClick={() => { units == EUnits.Kg ? setUnits(EUnits.Lbs) : setUnits(EUnits.Kg) }}>
                {units}
            </button>
            <div className="row overflow-auto h-100 p-2">
                {liftHistoryQuery.status === 'pending' ? (
                    <LoadingIndicator />
                ) : liftHistoryQuery.status === 'error' ? (
                    <ErrorIndicator error={liftHistoryQuery.error.message} />
                ) : (
                    <LiftHistoryTable lifts={liftHistoryQuery.data} units={units}/>
                )}
            </div>
        </div>
    )
}