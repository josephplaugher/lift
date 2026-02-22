import { useAuth0 } from "@auth0/auth0-react";
import ApiUrl from "../utilities/ApiUrl";
import { useEffect, useState } from "react";

export default function useGetToken() {
    const { getAccessTokenSilently } = useAuth0();
    const [token, setToken] = useState<string>("");
    useEffect(() => {
        (async function () {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: ApiUrl(),
                },
            });
            setToken(token);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return token;
}