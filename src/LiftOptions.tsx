import { FormEvent, useEffect, useState } from "react";
import ILiftOption from "./interfaces/LiftOptions.interfaces";
import ApiUrl from "./ApiUrl";

export default function LiftOptions() {
    const [liftOptions, setLiftOptions] = useState<ILiftOption[]>([]);
    const [name, setName] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [userMsg, setUserMsg] = useState<string>("");

    useEffect(() => {
        getLiftOptions();
    }, [])

    async function getLiftOptions() {
        console.log(ApiUrl())
        const response: any = await fetch(`${ApiUrl()}/api/liftoption`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        })
        const responseData: any = await response.json();
        console.log(response)
        setLiftOptions(responseData);
    }

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
            getLiftOptions();
            setUserMsg("Lift option added")
            setName("");
            setTimeout(() => setUserMsg(""), 5000)
        } catch (error: any) {
            console.log("error")
            setError(error)
        }
    }

    const options = liftOptions.map((l: ILiftOption) => <div key={l.Id} id={l.Id}>{l.Name}</div>)
    return (
        <>
            <div>
                {options}
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