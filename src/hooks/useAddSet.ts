import { Dispatch, FormEvent, SetStateAction, useRef, useState } from "react";
import { UseQueryResult } from "@tanstack/react-query";
import ILift from "../interfaces/ILift.interface";
import { TAddSetResponse, TPersonalRecord } from "../interfaces/IPersonalRecord";
import useGetToken from "./useGetToken";
import { FetchPatch, FetchPost } from "../utilities/Fetch";

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
    const [newPr, setNewPr] = useState<TPersonalRecord | null>(null);
    const [warningVisible, setWarningVisible] = useState<boolean>(false);
    const warningTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    const hasLiftName = Name.trim() !== "";
    // A cleared input parses to NaN, which fails this comparison the same as 0.
    const hasReps = [Set1, Set2, Set3, Set4, Set5].some((set) => Number(set) > 0);
    const canSubmit = hasLiftName && hasReps;
    const validationMessage = hasLiftName ? "Enter reps for at least one set" : "Choose a lift first";

    function notifyInvalid() {
        setWarningVisible(true);
        clearTimeout(warningTimeout.current);
        warningTimeout.current = setTimeout(() => setWarningVisible(false), 5000);
    }

    async function AddSets(e: FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        if (!canSubmit) {
            notifyInvalid();
            return;
        }
        setLoading(true);
        try {
            const response = await FetchPost(`lift`,
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
            const result: TAddSetResponse | null = await response.json().catch(() => null);
            if (!response.ok) {
                setError("That set could not be saved. Check the lift and try again.");
                return;
            }
            if (result?.newPr && result.weight != null && result.liftName) {
                setNewPr({ weight: result.weight, liftName: result.liftName })
            }
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
            const result = await FetchPatch(`lift`,
                {
                    Id: selectedLift.Id,
                    ...selectedLift
                },
                token)
            if (result.ok) {
                liftHistoryQuery.refetch();
                setUserMsg("Set Updated")
                setTimeout(() => setUserMsg(""), 5000)
            }
        } catch (error: any) {
            console.log("error")
            setError(error)
        } finally {
            setLoading(false);
        }
    }

    function dismissPr() {
        setNewPr(null);
    }

    return { AddSets, UpdateSets, Weight, setWeight, Set1, setSet1, Set2, setSet2, Set3, setSet3, Set4, setSet4, Set5, setSet5, newPr, dismissPr, canSubmit, notifyInvalid, validationMessage,
        showValidationWarning: warningVisible && !canSubmit }
}