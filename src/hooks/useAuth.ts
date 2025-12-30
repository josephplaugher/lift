import { useEffect } from "react";
import ApiUrl from "../utilities/ApiUrl";
import { useAuth0 } from "@auth0/auth0-react";

export default function useAuth(): any {
    const { error, user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            (async function() {
                let token;
                try {
                    token = await getAccessTokenSilently({
                        authorizationParams: {
                            audience: ApiUrl(),
                        },
                    });
                    console.log('Access token acquired', token);
                    const payload = JSON.parse(atob(token.split('.')[1]));
console.log("payload: ",payload);

                } catch (error: any) {
                    console.log('Silent token aqcuisition failed', error);
                }

                try {
                    const resp = await fetch(`${ApiUrl()}/api/auth/protected`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (!resp.ok) throw new Error("auth response error");
                    const data = await resp.json();
                    console.log('auth response', data);

                } catch (e) {
                    console.error('Failed to get token', e);
                }
            })();
        }
    }, [isLoading, isAuthenticated, getAccessTokenSilently]);


    return { error, user, isAuthenticated, isLoading, getAccessTokenSilently }
}