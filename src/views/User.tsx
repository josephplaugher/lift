import { useAuth0 } from '@auth0/auth0-react';

interface AuthProps {

}

export default function User() {
    const { logout, user } = useAuth0()
    return (
        <div className='row'>
            <div className="col d-flex flex-column mt-5 justify-content-between align-items-center text-center">
                <div>Hello {user?.given_name}</div>
                <button className="btn btn-primary align-self-center mt-5" onClick={() => logout()}>Sign Out</button>
            </div>
        </div>
    );
}
