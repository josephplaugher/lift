import { FormEvent, useState } from "react";
import ILiftOption from "./interfaces/LiftOptions.interfaces";
import ApiUrl from "./ApiUrl";
import { useQuery } from "@tanstack/react-query";
import GetLiftOptions from "./data/GetLiftOptions";
import { ErrorIndicator, LoadingIndicator } from "./components/StatusIndicators";

export default function LiftOptions() {
    const [name, setName] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [userMsg, setUserMsg] = useState<string>("");
    const liftOptionsQuery = useQuery<ILiftOption[]>({ queryKey: ['liftOptions'], queryFn: GetLiftOptions })

    async function addOption(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            await fetch(`${ApiUrl()}/api/liftoption`, {
                body: JSON.stringify({ Name: name }),
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                method: "post"
            })
            liftOptionsQuery.refetch();
            setUserMsg("Lift option added")
            setName("");
            setTimeout(() => setUserMsg(""), 5000)
        } catch (error: any) {
            console.log("error")
            setError(error)
        }
    }

    return (
        <>
            <div>
                {liftOptionsQuery.status === 'pending' ? (
                    <LoadingIndicator />
                ) : liftOptionsQuery.status === 'error' ? (
                    <ErrorIndicator error={liftOptionsQuery.error.message} />
                ) : (
                    <>
                        {liftOptionsQuery.data.map((l: ILiftOption) => <div className="m-2" key={l.Id} id={l.Id}>{l.Name}</div>)}
                    </>
                )}
            </div>
            <div>
                <form onSubmit={(e) => addOption(e)}>
                    <input name="Name" value={name} onChange={(e) => setName(e.target.value)} required></input>
                    <button type="submit">Add</button>
                </form>
                {error && <p>{error}</p>}
                {userMsg && <p>{userMsg}</p>}
            </div>
        </>
    )
}