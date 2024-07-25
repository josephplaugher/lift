import { useState } from "react";
import LiftSession from "./LiftSession";
import LiftHistory from "./LiftHistory";
import LiftOptions from "./LiftOptions";

enum ITabOptions {
    Lift = "Lift",
    LiftHistory = "LiftHistory",
    LiftOptions = "LiftOpions"
}
export default function Lift() {
    const [tab, setTab] = useState<ITabOptions>(ITabOptions.Lift)
    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <button className="btn btn-primary" onClick={() => setTab(ITabOptions.Lift)}>Lift Session</button>
                <button className="btn btn-primary" onClick={() => setTab(ITabOptions.LiftOptions)}>Lift Options</button>
                <button className="btn btn-primary" onClick={() => setTab(ITabOptions.LiftHistory)}> Lift History</button>
            </div>
            <div>
                {tab == ITabOptions.Lift && <LiftSession />}
                {tab == ITabOptions.LiftHistory && <LiftHistory />}
                {tab == ITabOptions.LiftOptions && <LiftOptions />}
            </div>
        </>
    )
}