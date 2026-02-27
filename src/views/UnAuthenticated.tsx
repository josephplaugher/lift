import { useAuth0 } from '@auth0/auth0-react';

export default function UnAuthenticated() {
    const { loginWithRedirect } = useAuth0()
    return (
        <div className="d-flex justify-content-between align-items-center text-center">
            <h1>Lift App</h1>
            <button className="btn btn-primary align-self-center"
                onClick={() => loginWithRedirect({
                    authorizationParams: {
                        scope: 'openid profile email offline_access'
                    }
                })}>Sign In</button>
            <button className="btn btn-primary align-self-center"
                onClick={() => loginWithRedirect({
                    authorizationParams: {
                        screen_hint: "signup",
                        scope: 'openid profile email offline_access'
                    }
                })}>Sign Up</button>
        </div>
    );
}
