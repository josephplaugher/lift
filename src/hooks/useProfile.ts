import { useAuth0 } from "@auth0/auth0-react";
import { useCallback, useEffect, useRef, useState } from "react";
import ApiUrl from "../utilities/ApiUrl";
import { FetchGet, FetchPatch } from "../utilities/Fetch";
import { TUserProfile } from "../interfaces/IUserProfile";

function hasRealName(name?: string, email?: string) {
    if (!name?.trim()) return false;
    if (!email) return true;
    return name.trim().toLowerCase() !== email.trim().toLowerCase();
}

export default function useProfile() {
    const { user, isAuthenticated, isLoading: authLoading, getAccessTokenSilently } = useAuth0();
    const [profile, setProfile] = useState<TUserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const bootstrappedForSub = useRef<string | null>(null);
    const autoSaveAttempted = useRef(false);

    const getToken = useCallback(async () => {
        return getAccessTokenSilently({
            authorizationParams: { audience: ApiUrl() },
        });
    }, [getAccessTokenSilently]);

    const fetchProfile = useCallback(async () => {
        const token = await getToken();
        const response = await FetchGet("user", token);
        if (!response.ok) {
            throw new Error("Failed to load profile");
        }
        return (await response.json()) as TUserProfile;
    }, [getToken]);

    const saveFullName = useCallback(async (fullName: string) => {
        const token = await getToken();
        const response = await FetchPatch("user/profile", { fullName }, token);
        if (!response.ok) {
            throw new Error("Failed to save profile");
        }
        const updated = await response.json();
        const next = {
            fullName: updated.fullName as string,
            profileComplete: !!updated.profileComplete,
            emailVerified: !!user?.email_verified,
        };
        setProfile(next);
        return updated as { fullName: string; profileComplete: boolean };
    }, [getToken, user?.email_verified]);

    const refreshProfile = useCallback(async () => {
        const me = await fetchProfile();
        const next = {
            ...me,
            emailVerified: !!user?.email_verified,
        };
        setProfile(next);
        bootstrappedForSub.current = user?.sub ?? null;
        return next;
    }, [fetchProfile, user?.email_verified, user?.sub]);

    useEffect(() => {
        if (authLoading) return;

        if (!isAuthenticated || !user?.sub) {
            bootstrappedForSub.current = null;
            autoSaveAttempted.current = false;
            setProfile(null);
            setLoading(false);
            return;
        }

        if (bootstrappedForSub.current === user.sub && profile) {
            if (profile.emailVerified !== !!user.email_verified) {
                setProfile({ ...profile, emailVerified: !!user.email_verified });
            }
            setLoading(false);
            return;
        }

        let cancelled = false;

        (async () => {
            setLoading(true);
            setError(null);
            try {
                let me = await fetchProfile();
                // ID token is source of truth for email_verified (no Auth0 Actions)
                me = { ...me, emailVerified: !!user.email_verified };

                if (
                    !me.profileComplete
                    && !autoSaveAttempted.current
                    && hasRealName(user.name, user.email)
                ) {
                    autoSaveAttempted.current = true;
                    await saveFullName(user.name!);
                    me = {
                        ...(await fetchProfile()),
                        emailVerified: !!user.email_verified,
                    };
                }

                if (!cancelled) {
                    bootstrappedForSub.current = user.sub!;
                    setProfile(me);
                }
            } catch (e: any) {
                if (!cancelled) {
                    setError(e?.message ?? "Failed to load profile");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
        // Bootstrap once per authenticated sub; claim sync handled above.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authLoading, isAuthenticated, user?.sub, user?.email_verified, user?.name, user?.email]);

    return {
        profile,
        loading: authLoading || loading,
        error,
        saveFullName,
        refreshProfile,
    };
}
