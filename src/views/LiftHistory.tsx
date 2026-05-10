import ILift, { ILiftGraphable } from "../interfaces/ILift.interface";
import LiftHistoryTable from "../components/LiftHistoryTable";
import { useQuery } from "@tanstack/react-query";
import GetLiftHistory, { GetLiftHistoryGrouped } from "../data/GetLiftHistory";
import { ErrorIndicator, LoadingIndicator } from "../components/StatusIndicators";
import { Dispatch, SetStateAction, useState } from "react";
import { EUnits } from "../interfaces/IUnits.enum";
import useGetToken from "../hooks/useGetToken";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faRefresh } from "@fortawesome/free-solid-svg-icons";

export default function LiftHistory({ name, setName }: { name: string, setName: Dispatch<SetStateAction<string>> }) {
    const [units, setUnits] = useState<EUnits>(EUnits.Kg);
    const token = useGetToken();
    const [startDate, setStartDate] = useState<string>(
        new Date(new Date().setDate(new Date().getDate() - 366)).toISOString().split("T")[0]);
    const [endDate, setEndDate] = useState<string>(new Date().toISOString().split("T")[0]);

    const q = useQuery<ILiftGraphable[]>({
        enabled: token != "",
        queryKey: ['liftHistoryGrouped', name, startDate, endDate],
        queryFn: () => GetLiftHistoryGrouped(token, name, startDate, endDate)
    })

    return (
        <div className="container-fluid">
            <div className="row mb-3">
                <div className="col d-flex justify-content-between align-items-center text-center">
                    <h2>{name}</h2>
                    <button className="btn btn-primary btn-sm me-3"
                        onClick={() => setStartDate(new Date(new Date().setDate(new Date().getDate() - 366)).toISOString().split("T")[0])}>
                        <FontAwesomeIcon icon={faRefresh} />
                    </button>
                </div>
                <div className="row d-flex justify-content-between align-items-center text-center">
                    <div className="col-6">
                        <input type="date" className="form-control form-control-sm" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                    <div className="col-6 align-self-end">
                        <input type="date" className="form-control form-control-sm" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    {q.status === 'pending' ? (
                        <LoadingIndicator />
                    ) : q.status === 'error' ? (
                        <ErrorIndicator error={q.error.message} />
                    ) : (
                        q.data && q.data.length > 0 &&
                        <ResponsiveContainer width="100%" height={300} aspect={1}>
                            <LineChart
                                data={q.data}
                                margin={{ top: 5, right: 10, left: 10, bottom: 5 }} // negative left margin to reclaim space from YAxis
                            >
                                <XAxis dataKey="Date" stroke="red" tick={{ fontSize: 10 }} tickCount={4} />
                                <YAxis stroke="red" tick={{ fontSize: 10 }} width={30} />
                                <Tooltip
                                    cursor={{ stroke: 'blue' }}
                                    contentStyle={{
                                        backgroundColor: 'gray',
                                        borderColor: 'blue',
                                        fontSize: 12,
                                    }}
                                />
                                <Legend wrapperStyle={{ fontSize: 12 }} />
                                <Line type="monotone" dataKey={"Load"} stroke="green" dot={false} activeDot={{ r: 6, stroke: 'blue' }} />
                                <RechartsDevtools />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </div>
    )
}