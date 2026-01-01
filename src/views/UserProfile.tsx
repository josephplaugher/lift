import { useAuth0, User } from '@auth0/auth0-react';

interface AuthProps {

}

type TProfileParams = {
    user: User
} 
export default function UserProfile({user}: TProfileParams) {
    const { logout } = useAuth0()
    return (
        <div className='row'>
            <div className="col d-flex flex-column mt-5 justify-content-between align-items-center text-center">
                <div>Hello {user?.given_name}</div>
                <button className="btn btn-primary align-self-center mt-5" onClick={() => logout()}>Sign Out</button>
            </div>
        </div>
    );
}
