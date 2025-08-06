import { FormEvent, useEffect, useState } from "react";
import ILift from "./interfaces/ILift.interface";
import ILiftOption from "./interfaces/LiftOptions.interfaces";
import ApiUrl from "./ApiUrl";

const liftInputStyle: React.CSSProperties = {
    width: "60px"
}

const inputgroup: React.CSSProperties = {
    display: "flex", flexDirection: "column", alignItems: "center", padding: "3px"
}

export default function LiftSession() {
    const [liftOptions, setLiftOptions] = useState<ILiftOption[]>([]);
    const [lifts, setLifts] = useState<ILift[]>([]);
    const [error, setError] = useState<string>("");
    const [userMsg, setUserMsg] = useState<string>("");
    const [Name, setName] = useState<string>("Deadlift");
    const [Weight, setWeight] = useState<number | string>(20)
    const [Set1, setSet1] = useState<number | string>(0)
    const [Set2, setSet2] = useState<number | string>(0)
    const [Set3, setSet3] = useState<number | string>(0)
    const [Set4, setSet4] = useState<number | string>(0)
    const [Set5, setSet5] = useState<number | string>(0)
    const [kg20, setKg20] = useState<number>(0)
    const [kg15, setKg15] = useState<number>(0)
    const [kg10, setKg10] = useState<number>(0)
    const [kg5, setKg5] = useState<number>(0)
    const [kg2_5, setKg2_5] = useState<number>(0)

    useEffect(() => {
        getLiftOptions();
        getLifts();
    }, [])

    useEffect(() => {
        getLifts();
    }, [Name])

    useEffect(() => {
        const w: number = ((kg20 + kg15 + kg10 + kg5 + kg2_5) * 2) + 20;
        setWeight(w)
    }, [kg20, kg15, kg10, kg5, kg2_5])

    async function getLiftOptions() {
        const response: any = await fetch(`${ApiUrl()}/api/liftoption`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        })
        const responseData: any = await response.json();
        setLiftOptions(responseData);
    }

    async function getLifts() {
        if (Name) {
            const response: any = await fetch(`${ApiUrl()}/api/lift/${Name.replace(" ", "_")}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
            })
            const responseData: any = await response.json();
            responseData && setLifts(responseData)
            responseData && setName(responseData[0].Name)
            responseData && setWeight(20)
        }
    }

    async function addSets(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            await fetch(`${ApiUrl()}/api/lift`, {
                body: JSON.stringify({
                    Name,
                    Weight,
                    Set1,
                    Set2,
                    Set3,
                    Set4,
                    Set5
                }),
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                method: "post"
            })
            getLifts();
            setUserMsg("Sets Recorded")
            setTimeout(() => setUserMsg(""), 5000)
            setSet1(0)
            setSet2(0)
            setSet3(0)
            setSet4(0)
            setSet5(0)
            setWeight(20)
        } catch (error: any) {
            console.log("error")
            setError(error)
        }
    }

    return (
        <>
            <div className="container-fluid py-0 px-2" style={{ height: "80vh" }}>
                <div className="row overflow-scroll">
                    {lifts.length > 0 && lifts.map((l: ILift) =>
                        <small key={l.Id}>
                            <div id={l.Id} className="d-flex justify-content-between my-2">
                                <div>{l.Date}</div>
                                <div>{l.Name}</div>
                                <div>{l.Weight}</div>
                                <div>{l.Set1 && l.Set1}</div>
                                <div>{l.Set2 && l.Set2}</div>
                                <div>{l.Set3 && l.Set3}</div>
                                <div>{l.Set4 && l.Set4}</div>
                                <div>{l.Set5 && l.Set5}</div>
                            </div>
                        </small>)}
                </div>
            </div>
            <div className="container-fluid pb-3" style={{ bottom: "0", position: "absolute" }}>
                <div className="row pb-3" >
                    <div className="col">
                        <select onChange={(e) => setName(e.target.value)} className="form-control">
                            {liftOptions.map((l: ILiftOption) =>
                                <option key={l.Id} id={l.Id} value={l.Name}>{l.Name}</option>
                            )}
                        </select>
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <form onSubmit={(e) => addSets(e)}>
                            <input name="name" value={Name} hidden onChange={() => { }}></input>
                            <div className="d-flex justify-content-between align-items-center">
                                <div className={`btn ${kg20 == 0 ? "btn-secondary" : "btn-primary"}`} onClick={() => kg20 == 0 ? setKg20(20) : setKg20(0)}><small>20kg</small></div>
                                <div className={`btn ${kg15 == 0 ? "btn-secondary" : "btn-primary"}`} onClick={() => kg15 == 0 ? setKg15(15) : setKg15(0)}><small>15kg</small></div>
                                <div className={`btn ${kg10 == 0 ? "btn-secondary" : "btn-primary"}`} onClick={() => kg10 == 0 ? setKg10(10) : setKg10(0)}><small>10kg</small></div>
                                <div className={`btn ${kg5 == 0 ? "btn-secondary" : "btn-primary"}`} onClick={() => kg5 == 0 ? setKg5(5) : setKg5(0)}><small>5kg</small></div>
                                <div className={`btn ${kg2_5 == 0 ? "btn-secondary" : "btn-primary"}`} onClick={() => kg2_5 == 0 ? setKg2_5(2.5) : setKg2_5(0)}><small>2.5kg</small></div>
                                <div style={inputgroup}>
                                    <input type="number" style={liftInputStyle} name="Weight" placeholder="Weight" value={Weight} readOnly></input>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between py-3">
                                <div style={inputgroup}>
                                    <label htmlFor="Set1">Set 1</label>
                                    <input type="number" style={liftInputStyle} id="Set1" name="Set1" value={Set1} onChange={(e) => setSet1(parseInt(e.target.value))} pattern="\d*" inputMode="numeric" required></input>
                                </div>
                                <div style={inputgroup}>
                                    <label htmlFor="Set2">Set 2</label>
                                    <input type="number" style={liftInputStyle} id="Set2" name="Set2" value={Set2} onChange={(e) => setSet2(parseInt(e.target.value))} pattern="\d*" inputMode="numeric"></input>
                                </div>
                                <div style={inputgroup}>
                                    <label htmlFor="Set3">Set 3</label>
                                    <input type="number" style={liftInputStyle} id="Set3" name="Set3" value={Set3} onChange={(e) => setSet3(parseInt(e.target.value))} pattern="\d*" inputMode="numeric"></input>
                                </div>
                                <div style={inputgroup}>
                                    <label htmlFor="Set4">Set 4</label>
                                    <input type="number" style={liftInputStyle} id="Set4" name="Set4" value={Set4} onChange={(e) => setSet4(parseInt(e.target.value))} pattern="\d*" inputMode="numeric"></input>
                                </div>
                                <div style={inputgroup}>
                                    <label htmlFor="Set5">Set 5</label>
                                    <input type="number" style={liftInputStyle} id="Set5" name="Set5" value={Set5} onChange={(e) => setSet5(parseInt(e.target.value))} pattern="\d*" inputMode="numeric"></input>
                                </div>
                            </div>
                            <div className="d-flex justify-content-end">
                                <button type="submit" className="btn btn-primary">Add Sets</button>
                            </div>
                        </form>
                        {error && <p>{error}</p>}
                        {userMsg && <p>{userMsg}</p>}
                    </div>
                </div>
            </div >
        </>
    )
}