import { useAuth0 } from '@auth0/auth0-react';

interface AuthProps {
   
}

export default function Auth() {
    const { loginWithRedirect } = useAuth0()
    return (
        <div className="d-flex justify-content-between align-items-center text-center">
            <button className="btn btn-primary align-self-center" onClick={() => loginWithRedirect()}>Sign In</button>
        </div>
    );
}
