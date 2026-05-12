import { useAuth0 } from '@auth0/auth0-react';
import barbell from "../images/barbell.svg";

export default function UnAuthenticated() {
    const { loginWithRedirect } = useAuth0()
    return (
        <div className="d-flex flex-column justify-content-center align-items-center text-center vh-100">
            <h1 className='text-lift' style={{fontSize: "3em"}}><em><strong>Lift!</strong></em></h1>
            <div><img src={barbell} width={"300px"} /></div>
            <div className="d-flex justify-content-around w-100">
                <button className="btn btn-lift text-white align-self-center my-2 p-3"
                    onClick={() => loginWithRedirect({
                        authorizationParams: {
                            scope: 'openid profile email offline_access'
                        }
                    })}>Sign In</button>
                <button className="btn border-lift text-lift align-self-center p-3"
                    onClick={() => loginWithRedirect({
                        authorizationParams: {
                            screen_hint: "signup",
                            scope: 'openid profile email offline_access'
                        }
                    })}>Sign Up</button>
            </div>
        </div>
    );
}
