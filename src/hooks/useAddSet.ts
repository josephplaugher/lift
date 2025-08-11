import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import ApiUrl from "../utilities/ApiUrl";
import { UseQueryResult } from "@tanstack/react-query";
import ILift from "../interfaces/ILift.interface";

export default function useAddSets(
    liftHistoryQuery: UseQueryResult<ILift[]>, Name: string, 
    setUserMsg: React.Dispatch<SetStateAction<string>>,setError: Dispatch<SetStateAction<string>>,
    loading: boolean, setLoading: Dispatch<SetStateAction<boolean>>) {
    const [Weight, setWeight] = useState<number | string>(20);
    const [Set1, setSet1] = useState<number | string>(0);
    const [Set2, setSet2] = useState<number | string>(0);
    const [Set3, setSet3] = useState<number | string>(0);
    const [Set4, setSet4] = useState<number | string>(0);
    const [Set5, setSet5] = useState<number | string>(0);

    async function AddSets(e: FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        setLoading(true);
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
            liftHistoryQuery.refetch();
            setUserMsg("Sets Recorded!")
            setTimeout(() => setUserMsg(""), 5000)
            setSet1(0)
            setSet2(0)
            setSet3(0)
            setSet4(0)
            setSet5(0)
            setWeight(20)
            setLoading(false);
        } catch (error: any) {
            console.log("error")
            setError(error)
            setLoading(false);
        }
    }

    return { AddSets, Weight, setWeight, Set1, setSet1, Set2, setSet2, Set3, setSet3, Set4, setSet4, Set5, setSet5 }
}