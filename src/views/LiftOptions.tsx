import ILiftOption from "../interfaces/LiftOptions.interfaces";
import { ErrorIndicator, LoadingIndicator } from "../components/StatusIndicators";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons/faCirclePlus";
import useLiftOption from "../hooks/useLiftOption";
import { faCancel, faSave } from "@fortawesome/free-solid-svg-icons";

export default function LiftOptions() {
    const {
        loading,
        liftOptionsQuery,
        name,
        setName,
        setSelectedId,
        isBarbellLift,
        setIsBarbellLift,
        userMsg,
        error,
        confirmDeleteModalOpen,
        setConfirmDeleteModelOpen,
        setConfirmDelete,
        addOption,
        updateOption,
        deleteOption,
        editing,
        setEditing
    } = useLiftOption();

    return (
        <>
            <div className="container-fluid" data-testid="options-list" style={{height: "90vh", overflowY: "auto"}}>
                <div className="row">
                    <div className={`d-flex justify-content-between py-2 ${editing && "border border-2 border-warning"}`} data-testid="add-options">
                        <div className="">
                            <input className="w-auto form-control control-sm" name="Name" value={name}
                                onChange={(e) => setName(e.target.value)} placeholder="Lift Name..." required></input>
                        </div>
                        <div className="align-items-end mt-1" title="Check if this lift requires a barbell. I.E. deadlift vs kettlebell deadlift">
                            <label className="form-check-label me-1" htmlFor="barbellLiftCheckbox">
                                Barbell Lift
                            </label>
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="barbellLiftCheckbox"
                                name="isBarbellLift"
                                checked={isBarbellLift}
                                onChange={(e) => setIsBarbellLift(e.target.checked)}
                            />
                        </div>
                        <div>
                            {editing ?
                                <>
                                    <FontAwesomeIcon className="fa-xl text-primary mt-1" icon={faSave} onClick={() => updateOption()} />
                                    <FontAwesomeIcon className="fa-xl text-primary mt-1" icon={faCancel} onClick={() => {
                                        setEditing(false); setName(""); setIsBarbellLift(false);
                                    }
                                    } />
                                </>
                                :
                                <FontAwesomeIcon className="fa-xl text-primary mt-1" icon={faCirclePlus} onClick={() => addOption()} />
                            }
                        </div>
                    </div>
                    {editing}
                    {editing && <div className="text-center"><em>Editing Lift Option</em></div>}
                    {error && <p>{error}</p>}
                    {loading && <LoadingIndicator />}
                    {userMsg && <div className="text-center text-success fw-bold">{userMsg}</div>}
                </div>
                <div className="row">
                    <table className="table" data-testid="lift-history-table">
                        <thead>
                            <tr>
                                <th>Lift Name</th>
                                <th>Barbell Lift</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {liftOptionsQuery.status === 'pending' ? (
                                <tr><td colSpan={2}><LoadingIndicator /></td></tr>
                            ) : liftOptionsQuery.status === 'error' ? (
                                <tr><td colSpan={2}><ErrorIndicator error={liftOptionsQuery.error.message} /></td></tr>
                            ) : (
                                <>
                                    {liftOptionsQuery.data.length > 0 ? liftOptionsQuery.data.map((l: ILiftOption) =>
                                        <tr className="m-2" key={l.Id} id={l.Id}>
                                            <td> {l.Name}</td>
                                            <td> {l.IsBarbellLift ? "Yes" : "No"}</td>
                                            <td><button className="btn btn-sm btn-primary"
                                                onClick={() => {
                                                    setEditing(true);
                                                    setName(l.Name);
                                                    setIsBarbellLift(l.IsBarbellLift);
                                                    setSelectedId(l.Id);
                                                }}>Edit</button>
                                            </td>
                                            <td><button className="btn btn-sm btn-secondary"
                                                onClick={() => {
                                                    setSelectedId(l.Id)
                                                    setConfirmDeleteModelOpen(true);
                                                }}>Delete</button>
                                            </td>
                                        </tr>) :
                                        <tr><td>Nothing Here</td></tr>
                                    }
                                </>
                            )}
                        </tbody>
                    </table>
                </div>

                {confirmDeleteModalOpen &&
                    <dialog open className="border border-3 border-danger">
                        <div className="text-center">
                            <p>Do you really want to delete this lift?</p>
                            <p><strong>{name}</strong></p>
                            <p><em>This action cannot be undone. If you have already tracked sets for this lift, they will be deleted as well.</em></p>
                        </div>
                        <div className="d-flex justify-content-around">
                            <button className="btn btn-primary btn-sm" onClick={() => setConfirmDeleteModelOpen(false)}>No</button>
                            <button className="btn btn-danger btn-sm" onClick={() => {
                                setConfirmDelete(true);
                                deleteOption();
                            }}>Yes</button>
                        </div>
                    </dialog>
                }
            </div>
        </>
    )
}