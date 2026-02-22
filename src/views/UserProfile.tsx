import { User } from '@auth0/auth0-react';
import useGetToken from '../hooks/useGetToken';
import { ESubscriptionStatusEnum } from '../interfaces/ISubscriptionStatus.enum';


interface AuthProps {

}

type TProfileParams = {
    user: User;
    logout: () => void;
    subscribe: () => void;
    paid: ESubscriptionStatusEnum | null;
}
export default function UserProfile({ user, logout, subscribe, paid }: TProfileParams) {

    console.log("name",user)
    return (
        <div className='row'>
            <div className="col d-flex flex-column mt-5 justify-content-between align-items-center text-center">
                <div>Hello {user?.given_name || user?.name}</div>
                {paid == ESubscriptionStatusEnum.Active || paid == ESubscriptionStatusEnum.Trialing ?
                    <>
                        <p>user stuff here</p>
                    </>
                    :
                    <button className="btn btn-success align-self-center mt-5" onClick={() => subscribe()}>subscribe</button>
                }
                <button className="btn btn-primary align-self-center mt-5" onClick={() => logout()}>Sign Out</button>
            </div>
        </div>
    );
}
