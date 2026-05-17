import ILiftOption from "../interfaces/LiftOptions.interfaces";
import { ErrorIndicator, LoadingIndicator, LoadingIndicatorFullScreen } from "../components/StatusIndicators";
import { inputgroup, liftInputStyle } from "../constants/constants";
import LiftHistoryTable from "../components/LiftHistoryTable";
import { EUnits } from "../interfaces/IUnits.enum";
import ConvertUnits from "../utilities/ConvertUnits";
import useLiftSession from "../hooks/useLiftSession";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { Dispatch, SetStateAction } from "react";

export default function LiftSession({ name, setName, units, setUnits }: { name: string, setName: Dispatch<SetStateAction<string>>, units: EUnits, setUnits: Dispatch<SetStateAction<EUnits>> }) {
    const { error,
        loading,
        userMsg,
        kg252, setKg252,
        kg25, setKg25,
        kg202, setKg202,
        kg20, setKg20,
        kg15, setKg15,
        kg10, setKg10,
        kg5, setKg5,
        kg2_5, setKg2_5,
        liftHistoryQuery,
        liftOptionsQuery, deleteOption,
        selectedSet, setSelectedSet,
        handleChange, editing, setEditing, setConfirmDelete,
        confirmDeleteModalOpen, setConfirmDeleteModelOpen,
        AddSets, UpdateSets, Weight, setWeight, Set1, setSet1, Set2, setSet2,
        Set3, setSet3, Set4, setSet4, Set5, setSet5, isBarbellLift } = useLiftSession(name, units, setUnits)
    return (
        <>
            <div className="container-fluid py-0 px-2" style={{ height: "90vh" }}>
                <button className="toggle-btn btn btn-sm btn-lift text-white px-2 pb-1" onClick={() => { units == EUnits.Kg ? setUnits(EUnits.Lbs) : setUnits(EUnits.Kg) }}>
                    {units}
                </button>
                <div className="row overflow-auto p-2" style={{ height: "58vh" }}>
                    {liftHistoryQuery.status === 'pending' ? (
                        <LoadingIndicator />
                    ) : liftHistoryQuery.status === 'error' ? (
                        <ErrorIndicator error={liftHistoryQuery.error.message} />
                    ) : (
                        <LiftHistoryTable lifts={liftHistoryQuery.data} units={units} setSelectedSet={setSelectedSet} />
                    )}
                </div>
            </div>
            <div className="container-fluid py-3 border border-4 border-lift bg-light" style={{ bottom: "0", position: "absolute" }} data-testid="lift-session">
                <div className="row pb-3" >
                    <div className="col-9">
                        <select onChange={(e) => setName(e.target.value)} defaultValue={liftOptionsQuery.data?.[0].Name}
                            className={`form-control form-control-sm ${liftOptionsQuery.status == "pending" ? "bg-warning" : liftOptionsQuery.status == "error" ? "text-danger" : ""}`}>
                            {liftOptionsQuery.status === 'pending' ? (
                                <option value="">Getting lift options...</option>
                            ) : liftOptionsQuery.status === 'error' ? (
                                <option value="">Something went wrong...</option>
                            ) : (
                                liftOptionsQuery.data.map((l: ILiftOption) =>
                                    <option key={l.Id} id={l.Id} value={l.Name}>
                                        {l.Name}
                                    </option>
                                )
                            )}
                        </select>
                    </div>
                    <div className="col-2">
                        <input type="number" style={liftInputStyle} name="Weight" placeholder="Weight"
                            value={ConvertUnits(units, Number(Weight))} onChange={(e) => setWeight(parseInt(e.target.value))} />
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <form onSubmit={(e) => AddSets(e)}>
                            <input name="name" value={name} hidden onChange={() => { }} />
                            {isBarbellLift && <div className="d-flex justify-content-between align-items-center">
                                <div className={`btn ${kg252 == 0 ? "btn-secondary" : "btn-lift text-white"}`} onClick={() => kg252 == 0 ? setKg252(25) : setKg252(0)}><small>{ConvertUnits(units, 25)}</small></div>   
                                <div className={`btn ${kg25 == 0 ? "btn-secondary" : "btn-lift text-white"}`} onClick={() => kg25 == 0 ? setKg25(25) : setKg25(0)}><small>{ConvertUnits(units, 25)}</small></div>
                                <div className={`btn ${kg202 == 0 ? "btn-secondary" : "btn-lift text-white"}`} onClick={() => kg202 == 0 ? setKg202(20) : setKg202(0)}><small>{ConvertUnits(units, 20)}</small></div>
                                <div className={`btn ${kg20 == 0 ? "btn-secondary" : "btn-lift text-white"}`} onClick={() => kg20 == 0 ? setKg20(20) : setKg20(0)}><small>{ConvertUnits(units, 20)}</small></div>
                                <div className={`btn ${kg15 == 0 ? "btn-secondary" : "btn-lift text-white"}`} onClick={() => kg15 == 0 ? setKg15(15) : setKg15(0)}><small>{ConvertUnits(units, 15)}</small></div>
                                <div className={`btn ${kg10 == 0 ? "btn-secondary" : "btn-lift text-white"}`} onClick={() => kg10 == 0 ? setKg10(10) : setKg10(0)}><small>{ConvertUnits(units, 10)}</small></div>
                                <div className={`btn ${kg5 == 0 ? "btn-secondary" : "btn-lift text-white"}`} onClick={() => kg5 == 0 ? setKg5(5) : setKg5(0)}><small>{ConvertUnits(units, 5)}</small></div>
                                <div className={`btn ${kg2_5 == 0 ? "btn-secondary" : "btn-lift text-white"}`} onClick={() => kg2_5 == 0 ? setKg2_5(2.5) : setKg2_5(0)}><small>{ConvertUnits(units, 2.5)}</small></div>
                            </div>}
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
                            <div className="">
                                <button type="submit" className="btn btn-lift text-white w-100 p-3">Add Sets</button>
                            </div>
                        </form>
                        {error && <p>{error}</p>}
                        {userMsg && <p className="text-lift text-center fw-bold p-3">{userMsg} <FontAwesomeIcon icon={faCheck} className="text-success" /></p>}
                    </div>
                </div>
            </div >
            {editing &&
                <dialog open className="border border-3 border-lift" style={{ top: "80%" }}>
                    <form onSubmit={(e) => UpdateSets(e)}>
                        <input name="Name" value={selectedSet.Name} hidden onChange={() => { }}></input>
                        <div style={inputgroup}>
                            <p>Editing {selectedSet.Name}</p>
                        </div>
                        <div className="d-flex justify-content-center">
                            <label htmlFor="weight">Weight</label>
                            <input type="number" style={liftInputStyle} className="mx-2" id="weight" name="Weight" value={selectedSet.Weight} onChange={handleChange} pattern="\d*" inputMode="numeric" required></input>{units == EUnits.Kg ? "Kg" : "Lbs"}
                        </div>
                        <div className="d-flex justify-content-between py-3">
                            <div style={inputgroup}>
                                <label htmlFor="Set1">Set 1</label>
                                <input type="number" style={liftInputStyle} id="Set1" name="Set1" value={selectedSet.Set1} onChange={handleChange} pattern="\d*" inputMode="numeric" required></input>
                            </div>
                            <div style={inputgroup}>
                                <label htmlFor="Set2">Set 2</label>
                                <input type="number" style={liftInputStyle} id="Set2" name="Set2" value={selectedSet.Set2} onChange={handleChange} pattern="\d*" inputMode="numeric"></input>
                            </div>
                            <div style={inputgroup}>
                                <label htmlFor="Set3">Set 3</label>
                                <input type="number" style={liftInputStyle} id="Set3" name="Set3" value={selectedSet.Set3} onChange={handleChange} pattern="\d*" inputMode="numeric"></input>
                            </div>
                            <div style={inputgroup}>
                                <label htmlFor="Set4">Set 4</label>
                                <input type="number" style={liftInputStyle} id="Set4" name="Set4" value={selectedSet.Set4} onChange={handleChange} pattern="\d*" inputMode="numeric"></input>
                            </div>
                            <div style={inputgroup}>
                                <label htmlFor="Set5">Set 5</label>
                                <input type="number" style={liftInputStyle} id="Set5" name="Set5" value={selectedSet.Set5} onChange={handleChange} pattern="\d*" inputMode="numeric"></input>
                            </div>
                        </div>
                        <div className="d-flex justify-content-around">
                            <button type="submit" className="btn btn-lift w-100 p-3 m-2">Save Change</button>
                            <p className="btn btn-danger w-100 p-3 m-2 text-center"
                                onClick={() => {
                                    setEditing(false);
                                    setConfirmDeleteModelOpen(true);
                                }}>Delete</p>
                            <button type="button" className="btn btn-secondary w-100 p-3 m-2" onClick={() => setEditing(false)}>Close</button>
                        </div>
                    </form>
                    {error && <p>{error}</p>}
                    {userMsg && <p className="text-lift text-center fw-bold p-3">{userMsg} <FontAwesomeIcon icon={faCheck} className="text-success" /></p>}
                </dialog>
            }

            {confirmDeleteModalOpen &&
                <dialog open className="border border-3 border-danger">
                    <div className="text-center">
                        <p>Do you really want to delete this set?</p>
                        <p><em>This action cannot be undone.</em></p>
                    </div>
                    <div className="d-flex justify-content-around">
                        <button className="btn btn-lift btn-sm" onClick={() => setConfirmDeleteModelOpen(false)}>No</button>
                        <button className="btn btn-danger btn-sm" onClick={() => {
                            setConfirmDelete(true);
                            deleteOption();
                        }}>Yes</button>
                    </div>
                </dialog>
            }
            {loading && <div>
                <LoadingIndicatorFullScreen />
            </div>}
        </>
    )
}