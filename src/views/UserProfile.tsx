import { User } from '@auth0/auth0-react';
import { ESubscriptionStatusEnum } from '../interfaces/ISubscriptionStatus.enum';
import barbell from "../images/barbell.webp";

type TProfileParams = {
    user: User;
    logout: () => void;
    subscribe: () => void;
    paid: ESubscriptionStatusEnum | null;
}
export default function UserProfile({ user, logout, subscribe, paid }: TProfileParams) {
    return (
        <div className='row'>
            <div className='d-flex justify-content-end'><img src={barbell} width={"50vw"} /></div>
            <div className="col d-flex flex-column mt-5 justify-content-between align-items-center text-center">
                <h1 className='mb-5'>Hello {user?.given_name || user?.name}</h1>
                {paid == ESubscriptionStatusEnum.Active || paid == ESubscriptionStatusEnum.Trialing ?
                    <>
                        <p>You are subscribed monthly.</p>
                    </>
                    :
                    <button className="btn btn-success align-self-center mt-5" onClick={() => subscribe()}>subscribe</button>
                }
                <button className="btn btn-primary align-self-center mt-5" onClick={() => logout()}>Sign Out</button>
            </div>
        </div>
    );
}
