import { useState } from "react";
import ApiUrl from "../utilities/ApiUrl";
import useGetToken from "./useGetToken";
import { useQuery } from "@tanstack/react-query";
import ILiftOption from "../interfaces/LiftOptions.interfaces";
import GetLiftOptions from "../data/GetLiftOptions";
import { FetchDelete, FetchPatch, FetchPost } from "../utilities/Fetch";

export default function useLiftOption() {
    const [loading, setLoading] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [selectedId, setSelectedId] = useState<string>("");
    const [isBarbellLift, setIsBarbellLift] = useState<boolean>(false);
    const [userMsg, setUserMsg] = useState<string>("");
    const [error, setError] = useState<any>(null);
    const [confirmDeleteModalOpen, setConfirmDeleteModelOpen] = useState<boolean>(false);
    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
    const token = useGetToken();
    const [editing, setEditing] = useState<boolean>(false);

    const liftOptionsQuery = useQuery<ILiftOption[]>({ enabled: token != "", queryKey: ['liftOptions'], queryFn: () => GetLiftOptions(token) })

    async function addOption() {
        setLoading(true);
        try {
            const result = await FetchPost(`liftoption`,
                { Name: name, IsBarbellLift: isBarbellLift },
                token)
            if (result.ok) {
                liftOptionsQuery.refetch();
                setUserMsg("Lift option added")
                setName("");
                setTimeout(() => setUserMsg(""), 5000)
            }
        } catch (error: any) {
            console.log("error", error)
            setError("Something went wrong. Try again")
        } finally {
            setLoading(false);
        }
    }

    async function updateOption() {
        setLoading(true);
        try {
            const result = await FetchPatch(`liftoption`,
                { Name: name, IsBarbellLift: isBarbellLift, Id: selectedId },
                token)
            if (result.ok) {
                liftOptionsQuery.refetch();
                setUserMsg("Lift option updated")
                setName("");
                setTimeout(() => setUserMsg(""), 5000)
            }

        } catch (error: any) {
            console.log("error")
            setError(error)
        } finally {
            setLoading(false);
        }
    }

    async function deleteOption() {
        setLoading(true);
        try {
            const result = await FetchDelete(`liftoption`,
                { Id: selectedId },
                token)
            if (result.ok) {
                liftOptionsQuery.refetch();
                setUserMsg("Lift option deleted")
                setName("");
                setSelectedId("");
                setConfirmDeleteModelOpen(false);
                setTimeout(() => setUserMsg(""), 5000)
            }
        } catch (error: any) {
            console.log("error")
            setError(error)
        } finally {
            setLoading(false);
        }
    }

    return {
        liftOptionsQuery,
        name,
        setName,
        selectedId,
        setSelectedId,
        isBarbellLift,
        setIsBarbellLift,
        userMsg,
        setUserMsg,
        error,
        setError,
        confirmDeleteModalOpen,
        setConfirmDeleteModelOpen,
        confirmDelete,
        setConfirmDelete,
        addOption,
        updateOption,
        deleteOption,
        editing,
        setEditing
    };
}