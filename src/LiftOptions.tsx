import { FormEvent, useEffect, useRef, useState } from "react";
import ILiftOption from "./interfaces/LiftOptions.interfaces";

export default function LiftOptions() {
    const [liftOptions, setLiftOptions] = useState<ILiftOption[]>([]);
    const [name, setName] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [userMsg, setUserMsg] = useState<string>("");

    const formRef = useRef(null);

    useEffect(() => {
        getLiftOptions();
    }, [])

    async function getLiftOptions() {
        let response: any = await fetch("http://localhost:3011/api/liftoption", {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        })
        const responseData: any = await response.json();
        console.log("options ", responseData)
        setLiftOptions(responseData);
        setName("");
        setUserMsg("Lift option added")
        setTimeout(() => setUserMsg(""), 5000)
    }

    async function addOption(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            await fetch("http://localhost:3011/api/liftoption", {
                body: JSON.stringify({ Name: name }),
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                method: "post"
            })
            getLiftOptions();
        } catch (error: any) {
            console.log("error")
            setError(error)
        }
    }

    const options = liftOptions.map((l: ILiftOption) => <div key={l.Id} id={l.Id}>{l.Name}</div>)
    return (
        <>
            <div>
                <p>lift options</p>
                {options}
            </div>
            <div>
                <form onSubmit={(e) => addOption(e)} ref={formRef}>
                    <input name="Name" value={name} onChange={(e) => setName(e.target.value)} required></input>
                    <button type="submit">Add</button>
                </form>
                {error && <p>{error}</p>}
                {userMsg && <p>{userMsg}</p>}
            </div>
        </>
    )
}