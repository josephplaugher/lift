import ILift from "../interfaces/ILift.interface";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis } from "recharts";
import { useQuery } from "@tanstack/react-query";
import GetLiftHistory from "../data/GetLiftHistory";
import { ErrorIndicator, LoadingIndicator } from "./StatusIndicators";

// Type definitions
interface DataPoint {
    date: string;
    value: number;
}
export default function ProgressChart(param: { name: string, lifts: ILift[] }) {
    const liftHistoryQuery = useQuery<ILift[]>({ queryKey: ['liftHistory', param.name], queryFn: () => GetLiftHistory(param.name) })

    // Custom tooltip with proper typing
//     const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
//   if (active && payload && payload.length) {
//             return (
//                 <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
//                     <p className="font-medium text-gray-700">{`${label}: ${payload[0].value?.toLocaleString()}`}</p>
//                 </div>
//             );
//         }
//         return null;
//     }

    function TimeSeriesData(lifts: ILift[]): any[] {
        const data: DataPoint[] = [];
        lifts.forEach((l: ILift) => {
            data.push({
                date: new Date(l.Date).toLocaleDateString(),
                value: l.Weight * (l.Set1 + l.Set2! + l.Set3! + l.Set4! + l.Set5!),
            });
        })
        return data;
    }

    return (
        <>
            {liftHistoryQuery.status === 'pending' ? (
                <LoadingIndicator />
            ) : liftHistoryQuery.status === 'error' ? (
                <ErrorIndicator error={liftHistoryQuery.error.message} />
            ) : (
                <ResponsiveContainer width="100%" height="90%">
                    <AreaChart data={TimeSeriesData(liftHistoryQuery.data)} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                        dataKey="date"
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                    />
                    <YAxis
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    {/* <Tooltip content={CustomTooltip} /> */}
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorGradient)"
                    />
                </AreaChart>
                </ResponsiveContainer >
            )
}
        </>
    )
}