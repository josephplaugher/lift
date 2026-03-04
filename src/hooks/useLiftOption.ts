import { useState } from "react";
import ApiUrl from "../utilities/ApiUrl";
import useGetToken from "./useGetToken";
import { useQuery } from "@tanstack/react-query";
import ILiftOption from "../interfaces/LiftOptions.interfaces";
import GetLiftOptions from "../data/GetLiftOptions";

export default function useLiftOption() {
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
        try {
            console.trace('liftoption fetch post');

            const result = await fetch(`${ApiUrl()}/api/liftoption`, {
                body: JSON.stringify({ Name: name, IsBarbellLift: isBarbellLift }),
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                method: "post"
            })
            if (result.ok) {
                liftOptionsQuery.refetch();
                setUserMsg("Lift option added")
                setName("");
                setTimeout(() => setUserMsg(""), 5000)
            }

        } catch (error: any) {
            console.log("error", error)
            setError("Something went wrong. Try again")
        }
    }

    async function updateOption() {
        try {
            console.log(ApiUrl())
            console.trace('liftoption fetch patch');
            const result = await fetch(`${ApiUrl()}/api/liftoption`, {
                body: JSON.stringify({ Name: name, IsBarbellLift: isBarbellLift, id: selectedId }),
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                method: "patch"
            })
            if (result.ok) {
                // liftOptionsQuery.refetch();
                setUserMsg("Lift option updated")
                setName("");
                setTimeout(() => setUserMsg(""), 5000)
            }

        } catch (error: any) {
            console.log("error")
            setError(error)
        }
    }

    async function deleteOption() {
        try {
            console.trace('liftoption fetch delete');
            const result = await fetch(`${ApiUrl()}/api/liftoption`, {
                body: JSON.stringify({ id: selectedId }),
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                method: "delete"
            })
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