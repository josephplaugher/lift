import ILift from "../interfaces/ILift.interface";

export default function LiftHistoryTable(param: { lifts: ILift[] }) {
    return (
        <>
            <table className="table" data-testid="lift-history-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Lift</th>
                        <th>KG</th>
                        <th>Sets</th>
                    </tr>
                </thead>
                <tbody>
                    {param.lifts.length > 0 ? (
                        <>
                            {param.lifts.map((l: ILift) =>
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
                        </>
                    ) : (
                        <tr><td colSpan={4}>Nothing here</td></tr>
                    )}
                </tbody>
            </table>
        </>
    )
}