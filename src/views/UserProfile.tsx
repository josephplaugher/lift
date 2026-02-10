import { useAuth0, User } from '@auth0/auth0-react';
import useGetToken from '../hooks/useGetToken';
import usePayment from '../hooks/usePayment';


interface AuthProps {

}

type TProfileParams = {
    user: User
}
export default function UserProfile({ user }: TProfileParams) {
    const { logout } = useAuth0()
    const token = useGetToken();
    const subscribe = usePayment(user.sub!);

    return (
        <div className='row'>
            <div className="col d-flex flex-column mt-5 justify-content-between align-items-center text-center">
                <div>Hello {user?.given_name}</div>
                <button className="btn btn-primary align-self-center mt-5" onClick={() => logout()}>Sign Out</button>
                <button className="btn btn-success align-self-center mt-5" onClick={() => subscribe()}>subscribe</button>
            </div>
        </div>
    );
}
