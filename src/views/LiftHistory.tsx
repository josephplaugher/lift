import { ILiftGraphable } from "../interfaces/ILift.interface";
import { useQuery } from "@tanstack/react-query";
import { GetLiftHistoryGrouped } from "../data/GetLiftHistory";
import { ErrorIndicator, LoadingIndicator } from "../components/StatusIndicators";
import { Dispatch, SetStateAction, useState } from "react";
import { EUnits } from "../interfaces/IUnits.enum";
import useGetToken from "../hooks/useGetToken";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import ConvertUnits from "../utilities/ConvertUnits";

const chartHeight = Math.round(window.innerHeight * 0.50);

export default function LiftHistory({ name, setName: _setName, units, setUnits }: { name: string, setName: Dispatch<SetStateAction<string>>, units: EUnits, setUnits: Dispatch<SetStateAction<EUnits>> }) {
    const token = useGetToken();
    const [startDate, setStartDate] = useState<string>(
        new Date(new Date().setDate(new Date().getDate() - 366)).toISOString().split("T")[0]);
    const [endDate, setEndDate] = useState<string>(new Date().toISOString().split("T")[0]);

    const q = useQuery<ILiftGraphable[]>({
        enabled: token != "",
        queryKey: ['liftHistoryGrouped', name, startDate, endDate],
        queryFn: () => GetLiftHistoryGrouped(token, name, startDate, endDate),
        select: (data: ILiftGraphable[]) => data.map((row: ILiftGraphable) => ({
            Date: row.Date,
            Load: units === EUnits.Lbs ? ConvertUnits(units, Number(row.Load)) : Number(row.Load) as number
        })) as ILiftGraphable[]
    })

    return (
        <div className="container-fluid px-0">
            <div className="row mb-3 g-0">
                <div className="col d-flex justify-content-between align-items-center text-center">
                    <h2>{name}</h2>
                    <div>
                        <button className="btn btn-primary btn-sm me-3"
                            onClick={() => setStartDate(new Date(new Date().setDate(new Date().getDate() - 366)).toISOString().split("T")[0])}>
                            <FontAwesomeIcon icon={faRefresh} />
                        </button>
                        <button className="btn btn-primary btn-sm" onClick={() => { units == EUnits.Kg ? setUnits(EUnits.Lbs) : setUnits(EUnits.Kg) }}>
                            {units}
                        </button>
                    </div>
                </div>
            </div>
            <div className="row mb-5">
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
                <div className="col min-w-0">
                    {q.status === 'pending' ? (
                        <LoadingIndicator />
                    ) : q.status === 'error' ? (
                        <ErrorIndicator error={q.error.message} />
                    ) : (
                        q.data && q.data.length > 0 &&
                        <ResponsiveContainer width="100%" height={chartHeight} aspect={1}>
                            <LineChart
                                data={q.data}
                                margin={{ top: 5, right: 70, left: 15, bottom: 5 }} // negative left margin to reclaim space from YAxis
                            >
                                <XAxis dataKey="Date" stroke="#060b47" tick={{ fontSize: 10 }} tickCount={4} />
                                <YAxis stroke="#060b47" tick={{ fontSize: 10 }} width={30} />
                                <Tooltip
                                    content={({ active, payload, label }) => {
                                        if (!active || !payload?.length) return null;
                                        return (
                                            <div style={{
                                                backgroundColor: 'grey',
                                                border: '1px solid #060b47',
                                                padding: '8px 12px',
                                                borderRadius: 6,
                                                fontSize: 12,
                                                color: '#060b47',
                                                opacity: 0.8,
                                            }}>
                                                <p>{label}</p>
                                                {payload.map((entry, i) => (
                                                    <>
                                                        <p key={i}>
                                                            {entry.name}: {entry.value} 
                                                        </p>
                                                        <p key={i}><small><em>Weight x the Sum of Sets</em></small></p>
                                                    </>
                                                ))}
                                            </div>
                                        );
                                    }}
                                />
                                <Legend wrapperStyle={{ fontSize: 12 }} />
                                <Line type="monotone" dataKey={"Load"} stroke="#060b47" dot={false} activeDot={{ r: 6, stroke: '#060b47' }} />
                                <RechartsDevtools />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </div>
    )
}