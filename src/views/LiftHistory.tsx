import { ErrorIndicator, LoadingIndicator } from "../components/StatusIndicators";
import { Dispatch, SetStateAction } from "react";
import { EUnits } from "../interfaces/IUnits.enum";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { RechartsDevtools } from "@recharts/devtools";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh, faShareNodes, faTrophy } from "@fortawesome/free-solid-svg-icons";
import useLiftHistory from "../hooks/useLiftHistory";

export default function LiftHistory({ name, units, setUnits }: { name: string, units: EUnits, setUnits: Dispatch<SetStateAction<EUnits>> }) {
    const {
        chartHeight,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        historyQuery,
        personalRecord,
        shareRef,
        sharing,
        shareError,
        canShare,
        shareProgress,
        resetDateRange,
        toggleUnits,
        formatWeight,
    } = useLiftHistory(name, units, setUnits);

    return (
        <div className="container-fluid px-0">
            <div className="row my-3 g-0">
                <div className="col d-flex justify-content-between align-items-center text-center text-lift">
                    <h2 className="ms-2">{name}</h2>
                    <div className="d-flex align-items-center mx-3 gap-2">
                        <button
                            type="button"
                            className="btn btn-lift text-white btn-sm"
                            aria-label="Share progress"
                            disabled={!canShare || sharing}
                            onClick={() => void shareProgress()}
                        >
                            <FontAwesomeIcon icon={faShareNodes} spin={sharing} />
                        </button>
                        <button
                            type="button"
                            className="btn btn-lift text-white btn-sm"
                            aria-label="Reset date range"
                            onClick={resetDateRange}
                        >
                            <FontAwesomeIcon icon={faRefresh} />
                        </button>
                        <button type="button" className="btn btn-lift text-white btn-sm" onClick={toggleUnits}>
                            {units}
                        </button>
                    </div>
                </div>
            </div>
            <div className="row mb-5">
                <div className="row d-flex justify-content-between align-items-center text-center">
                    <div className="col-6">
                        <input type="date" className="form-control form-control-sm ms-2" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                    <div className="col-6 align-self-end">
                        <input type="date" className="form-control form-control-sm" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col min-w-0">
                    <div ref={shareRef} className="progress-share-card px-2 pb-3">
                        <h3 className="progress-share-title text-lift text-center mb-3">{name}</h3>
                        {historyQuery.status === "pending" ? (
                            <LoadingIndicator />
                        ) : historyQuery.status === "error" ? (
                            <ErrorIndicator error={historyQuery.error.message} />
                        ) : (
                            historyQuery.data && historyQuery.data.length > 0 &&
                            <ResponsiveContainer width="100%" height={chartHeight} aspect={1}>
                                <LineChart
                                    data={historyQuery.data}
                                    margin={{ top: 5, right: 70, left: 15, bottom: 5 }}
                                >
                                    <XAxis dataKey="Date" stroke="#060b47" tick={{ fontSize: 10 }} tickCount={4} />
                                    <YAxis stroke="#060b47" tick={{ fontSize: 10 }} width={30} />
                                    <Tooltip
                                        content={({ active, payload, label }) => {
                                            if (!active || !payload?.length) return null;
                                            return (
                                                <div style={{
                                                    backgroundColor: "white",
                                                    border: "1px solid #060b47",
                                                    padding: "8px 12px",
                                                    borderRadius: 6,
                                                    fontSize: 12,
                                                    color: "#060b47",
                                                    opacity: 0.8,
                                                }}>
                                                    <p>{label}</p>
                                                    {payload.map((entry, i) => (
                                                        <>
                                                            <p key={i}>
                                                                Total {entry.name}: {entry.value}
                                                            </p>
                                                            <p key={i}><small><em>Weight: {formatWeight(entry.payload.Lift.Weight)}</em></small></p>
                                                            <p key={i}><small><em>Sets: {entry.payload.Lift.Set1},
                                                                {entry.payload.Lift.Set2 || 0},
                                                                {entry.payload.Lift.Set3 || 0},
                                                                {entry.payload.Lift.Set4 || 0},
                                                                {entry.payload.Lift.Set5 || 0}
                                                            </em></small></p>
                                                        </>
                                                    ))}
                                                </div>
                                            );
                                        }}
                                    />
                                    <Legend wrapperStyle={{ fontSize: 12 }} />
                                    <Line type="monotone" dataKey={"Load"} stroke="#060b47" dot={false} activeDot={{ r: 6, stroke: "#060b47" }} />
                                    <g data-share-exclude="true">
                                        <RechartsDevtools />
                                    </g>
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                        {personalRecord &&
                            <div className="progress-pr mt-3 mx-2 text-center" role="status">
                                <FontAwesomeIcon icon={faTrophy} className="progress-pr-trophy" />
                                <p className="progress-pr-label mb-0">Personal Record</p>
                                <p className="progress-pr-weight mb-0">
                                    {personalRecord.displayWeight}
                                    <span className="progress-pr-units"> {personalRecord.units}</span>
                                </p>
                            </div>
                        }
                        <p className="progress-share-brand text-center mb-0 mt-3" aria-hidden="true">Lift!</p>
                    </div>
                    {shareError && <p className="text-danger text-center mt-2 mb-0">{shareError}</p>}
                </div>
            </div>
        </div>
    )
}
