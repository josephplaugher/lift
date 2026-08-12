import { useEffect } from "react";
import ApiUrl from "../utilities/ApiUrl";
import { useAuth0 } from "@auth0/auth0-react";

function isMissingRefreshToken(error: unknown) {
    if (!error || typeof error !== "object") return false;
    const authError = error as { error?: string; message?: string };
    const message = authError.message?.toLowerCase() ?? "";
    return authError.error === "missing_refresh_token"
        || message.includes("missing refresh token");
}

export default function useAuth(): any {
    const { error, user, isAuthenticated, isLoading, getAccessTokenSilently, logout } = useAuth0();

    useEffect(() => {
        if (isLoading || !isAuthenticated) return
        (async function () {
            let token;
            try {
                token = await getAccessTokenSilently({
                    authorizationParams: {
                        audience: ApiUrl(),
                    },
                });
            } catch (error: any) {
                console.log('Silent token aqcuisition failed', error);
                if (isMissingRefreshToken(error)) {
                    await logout({ logoutParams: { localOnly: true }, openUrl: false });
                    window.location.assign('/login');
                }
                return;
            }

            try {
                await fetch(`${ApiUrl()}/api/auth`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } catch (e) {
                console.error('Failed to get token', e);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, isAuthenticated, getAccessTokenSilently]);


    useEffect(() => {
        if (!isMissingRefreshToken(error)) return;
        void logout({ logoutParams: { localOnly: true }, openUrl: false }).then(() => {
            window.location.assign('/login');
        });
    }, [error, logout]);

    return { error, user, isAuthenticated, isLoading, getAccessTokenSilently }
}