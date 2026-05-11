import { useEffect } from "react";
import ApiUrl from "../utilities/ApiUrl";
import { useAuth0 } from "@auth0/auth0-react";

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
                logout();
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


    return { error, user, isAuthenticated, isLoading, getAccessTokenSilently }
}