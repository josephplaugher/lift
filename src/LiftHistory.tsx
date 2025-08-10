import ILift from "./interfaces/ILift.interface";
import LiftHistoryTable from "./components/LiftHistoryTable";
import { useQuery } from "@tanstack/react-query";
import GetLiftHistory from "./data/GetLiftHistory";
import { ErrorIndicator, LoadingIndicator } from "./components/StatusIndicators";

export default function LiftHistory() {
    const liftHistoryQuery = useQuery<ILift[]>({ queryKey: ['liftHistory', "all"], queryFn: () => GetLiftHistory() })

    return (
        <div className="container-fluid py-0 px-2" style={{ height: "90vh" }}>
            <div className="row overflow-auto h-100 p-2">
                {liftHistoryQuery.status === 'pending' ? (
                    <LoadingIndicator />
                ) : liftHistoryQuery.status === 'error' ? (
                    <ErrorIndicator error={liftHistoryQuery.error.message} />
                ) : (
                    <LiftHistoryTable lifts={liftHistoryQuery.data} />
                )}
            </div>
        </div>
    )
}