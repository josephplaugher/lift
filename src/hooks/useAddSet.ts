import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { UseQueryResult } from "@tanstack/react-query";
import ILift from "../interfaces/ILift.interface";
import useGetToken from "./useGetToken";
import { FetchPost } from "../utilities/Fetch";

export default function useAddSets(
    liftHistoryQuery: UseQueryResult<ILift[]>, Name: string,
    setUserMsg: React.Dispatch<SetStateAction<string>>, setError: Dispatch<SetStateAction<string>>,
    setLoading: Dispatch<SetStateAction<boolean>>,
    selectedLift: ILift | undefined
) {
    const token = useGetToken();
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
            await FetchPost(`lift`,
                {
                    Name,
                    Weight,
                    Set1,
                    Set2,
                    Set3,
                    Set4,
                    Set5
                },
                token)
            liftHistoryQuery.refetch();
            setUserMsg("Set Saved")
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
        } finally {
            setLoading(false);
        }
    }

    async function UpdateSets(e: FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        if (!selectedLift?.Id) return;
        setLoading(true);
        try {
            await FetchPost(`lift/${selectedLift.Id}`,
                {
                    Name,
                    Weight,
                    Set1,
                    Set2,
                    Set3,
                    Set4,
                    Set5
                },
                token)
            liftHistoryQuery.refetch();
            setUserMsg("Set Updated")
            setTimeout(() => setUserMsg(""), 5000)
        } catch (error: any) {
            console.log("error")
            setError(error)
        } finally {
            setLoading(false);
        }
    }

    return { AddSets, UpdateSets, Weight, setWeight, Set1, setSet1, Set2, setSet2, Set3, setSet3, Set4, setSet4, Set5, setSet5 }
}