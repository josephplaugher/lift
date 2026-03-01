import { useAuth0 } from '@auth0/auth0-react';

export default function UnAuthenticated() {
    const { loginWithRedirect } = useAuth0()
    return (
        <div className="d-flex flex-column justify-content-center align-items-center text-center vh-100">
            <h1><strong>Lift!</strong></h1>
            <h2 className='my-3'>[logo here]</h2>
            <button className="btn btn-primary align-self-center my-2 p-3"
                onClick={() => loginWithRedirect({
                    authorizationParams: {
                        scope: 'openid profile email offline_access'
                    }
                })}>Sign In</button>
            <button className="btn btn-primary align-self-center p-3"
                onClick={() => loginWithRedirect({
                    authorizationParams: {
                        screen_hint: "signup",
                        scope: 'openid profile email offline_access'
                    }
                })}>Sign Up</button>
        </div>
    );
}
