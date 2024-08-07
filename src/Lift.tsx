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
            <div className="container-fluid p-0">
                <div className="row">
                    <div className="col p-0">
                        <button className={`btn btn-primary rounded-0 w-100 p-3 ${tab == ITabOptions.Lift ? "border-info" : "border-dark"}`} onClick={() => setTab(ITabOptions.Lift)}>
                            Lift Session
                        </button>
                    </div>
                    <div className="col p-0">
                        <button className={`btn btn-primary rounded-0 w-100 p-3 ${tab == ITabOptions.LiftOptions ? "border-info" : "border-dark"}`} onClick={() => setTab(ITabOptions.LiftOptions)}>
                            Lift Options
                        </button>
                    </div>
                    <div className="col p-0">
                        <button className={`btn btn-primary rounded-0 w-100 p-3 ${tab == ITabOptions.LiftHistory ? "border-info" : "border-dark"}`} onClick={() => setTab(ITabOptions.LiftHistory)}>
                            Lift History
                        </button>
                    </div>
                </div>
            </div>
            <div>
                {tab == ITabOptions.Lift && <LiftSession />}
                {tab == ITabOptions.LiftHistory && <LiftHistory />}
                {tab == ITabOptions.LiftOptions && <LiftOptions />}
            </div>
        </>
    )
}