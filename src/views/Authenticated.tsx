import { useState } from "react";
import LiftSession from "./LiftSession";
import LiftHistory from "./LiftHistory";
import LiftOptions from "./LiftOptions";
import UserProfile from "./UserProfile";
import { User } from "@auth0/auth0-react";
// import Payment from "./Payment";
import usePayment from "../hooks/usePayment";

enum ITabOptions {
    Lift = "Lift",
    LiftHistory = "LiftHistory",
    LiftOptions = "LiftOpions",
    Me = "Me"
}

type TLiftParams = {
    user: User
} 
export default function Authenticated({user}: TLiftParams) {
    const [tab, setTab] = useState<ITabOptions>(ITabOptions.Me)
    return (
        <>
            <div className="container-fluid p-0">
                <div className="row" data-testid="main-nav">
                    <div className="col p-0">
                        <button className={`btn btn-primary rounded-0 w-100 p-3 ${tab == ITabOptions.Lift ? "border-info" : "border-dark"}`} onClick={() => setTab(ITabOptions.Lift)}>
                            Lift
                        </button>
                    </div>
                    <div className="col p-0">
                        <button className={`btn btn-primary rounded-0 w-100 p-3 ${tab == ITabOptions.LiftOptions ? "border-info" : "border-dark"}`} onClick={() => setTab(ITabOptions.LiftOptions)}>
                            Options
                        </button>
                    </div>
                    <div className="col p-0">
                        <button className={`btn btn-primary rounded-0 w-100 p-3 ${tab == ITabOptions.LiftHistory ? "border-info" : "border-dark"}`} onClick={() => setTab(ITabOptions.LiftHistory)}>
                            History
                        </button>
                    </div>
                    <div className="col p-0">
                        <button className={`btn btn-primary rounded-0 w-100 p-3 ${tab == ITabOptions.Me ? "border-info" : "border-dark"}`} onClick={() => setTab(ITabOptions.Me)}>
                            Me
                        </button>
                    </div>
                </div>
            </div>
            <div>
                {tab == ITabOptions.Lift && <LiftSession />}
                {tab == ITabOptions.LiftHistory && <LiftHistory />}
                {tab == ITabOptions.LiftOptions && <LiftOptions />}
                {tab == ITabOptions.Me && <UserProfile user={user} />}
            </div>
        </>
    )
}