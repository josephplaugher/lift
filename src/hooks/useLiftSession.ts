import { FormEvent, useEffect, useState } from "react";
import ILift from "../interfaces/ILift.interface";
import ILiftOption from "../interfaces/LiftOptions.interfaces";
import { useQuery } from "@tanstack/react-query";
import GetLiftHistory from "../data/GetLiftHistory";
import GetLiftOptions from "../data/GetLiftOptions";
import useAddSets from "../hooks/useAddSet";
import { EUnits } from "../interfaces/IUnits.enum";
import useGetToken from "../hooks/useGetToken";
import { FetchPatch } from "../utilities/Fetch";

export default function useLiftSession() {
    const token = useGetToken();
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [userMsg, setUserMsg] = useState<string>("");
    const [Name, setName] = useState<string>("Deadlift");

    const [kg202, setKg202] = useState<number>(0);
    const [kg20, setKg20] = useState<number>(0);
    const [kg15, setKg15] = useState<number>(0);
    const [kg10, setKg10] = useState<number>(0);
    const [kg5, setKg5] = useState<number>(0);
    const [kg2_5, setKg2_5] = useState<number>(0);
    const [units, setUnits] = useState<EUnits>(EUnits.Kg);
    const [editing, setEditing] = useState<boolean>(false);
    const [selectedSet, setSelectedSet] = useState<ILift>({
        Name: '',
        Weight: 0,
        Date: '',
        Set1: 0,
    });


    const liftHistoryQuery = useQuery<ILift[]>({ enabled: token != "", queryKey: ['liftHistory', Name], queryFn: () => GetLiftHistory(token, Name) })
    const liftOptionsQuery = useQuery<ILiftOption[]>({ enabled: token != "", queryKey: ['liftOptions'], queryFn: () => GetLiftOptions(token) })
    const { AddSets, UpdateSets, Weight, setWeight, Set1, setSet1, Set2, setSet2, Set3, setSet3, Set4, setSet4, Set5, setSet5 } = useAddSets(liftHistoryQuery, Name, setUserMsg, setError, setLoading, selectedSet);

    useEffect(() => {
        const w: number = ((kg202 + kg20 + kg15 + kg10 + kg5 + kg2_5) * 2) + 20;
        setWeight(w)
    }, [setWeight, kg202, kg20, kg15, kg10, kg5, kg2_5])

    useEffect(() => {
        if (!selectedSet.Name) return;
        setEditing(true);
    }, [selectedSet])

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value, type } = e.target;
        setSelectedSet(prev => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value) : value
        }));
    };

    return {
        error, setError,
        loading, setLoading,
        userMsg, setUserMsg,
        Name, setName,
        kg202, setKg202,
        kg20, setKg20,
        kg15, setKg15,
        kg10, setKg10,
        kg5, setKg5,
        kg2_5, setKg2_5,
        units, setUnits,
        liftHistoryQuery,
        liftOptionsQuery,
        selectedSet, setSelectedSet, handleChange, editing, setEditing,
        AddSets, UpdateSets, Weight, setWeight, Set1, setSet1, Set2, setSet2, Set3, setSet3, Set4, setSet4, Set5, setSet5
    }
}