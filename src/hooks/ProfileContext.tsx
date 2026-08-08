import { createContext, ReactNode, useContext } from "react";
import useProfile from "./useProfile";
import { TUserProfile } from "../interfaces/IUserProfile";

type TProfileContext = {
    profile: TUserProfile | null;
    loading: boolean;
    error: string | null;
    saveFullName: (fullName: string) => Promise<{ fullName: string; profileComplete: boolean }>;
    refreshProfile: () => Promise<TUserProfile>;
};

const ProfileContext = createContext<TProfileContext | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
    const value = useProfile();
    return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfileContext() {
    const ctx = useContext(ProfileContext);
    if (!ctx) {
        throw new Error("useProfileContext must be used within ProfileProvider");
    }
    return ctx;
}
