import { useState } from "react";
import LiftSession from "./LiftSession";
import LiftHistory from "./LiftHistory";
import LiftOptions from "./LiftOptions";
import UserProfile from "./UserProfile";
import { useAuth0, User } from "@auth0/auth0-react";
import usePayment from "../hooks/usePayment";
import { ESubscriptionStatusEnum } from "../interfaces/ISubscriptionStatus.enum";
import { EUnits } from "../interfaces/IUnits.enum";

enum ITabOptions {
    Lift = "Lift",
    LiftHistory = "LiftHistory",
    LiftOptions = "LiftOpions",
    Me = "Me"
}

type TLiftParams = {
    user: User
}
export default function Authenticated({ user }: TLiftParams) {
    const [tab, setTab] = useState<ITabOptions>(ITabOptions.Lift)
    const { logout } = useAuth0()
    const { subscribe, paid } = usePayment(user.sub!);
    const [name, setName] = useState<string>("");
    const [units, setUnits] = useState<EUnits>(EUnits.Kg);
    
    if (paid == ESubscriptionStatusEnum.Active || paid == ESubscriptionStatusEnum.Trialing) return (
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
                {tab == ITabOptions.Lift && <LiftSession name={name} setName={setName} units={units} setUnits={setUnits} />}
                {tab == ITabOptions.LiftHistory && <LiftHistory name={name} setName={setName} units={units} setUnits={setUnits} />}
                {tab == ITabOptions.LiftOptions && <LiftOptions />}
                {tab == ITabOptions.Me && <UserProfile user={user} logout={logout} subscribe={subscribe} paid={paid} />}
            </div>
        </>
    )
    if (paid == ESubscriptionStatusEnum.PastDue || paid == null) return <UserProfile user={user} logout={logout} subscribe={subscribe} paid={paid} />
}