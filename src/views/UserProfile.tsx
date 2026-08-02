import { User } from '@auth0/auth0-react';
import { ESubscriptionStatusEnum } from '../interfaces/ISubscriptionStatus.enum';
import useCancelSubscription from '../hooks/useCancelSubscription';
import barbell from "../images/barbell.svg";

type TProfileParams = {
    user: User;
    logout: () => void;
    subscribe: () => void;
    cancel: (cancelReason?: string) => void;
    paid: ESubscriptionStatusEnum | null;
    cancelAtPeriodEnd: boolean;
    currentPeriodEnd: string | null;
}

function isSubscribed(paid: ESubscriptionStatusEnum | null) {
    const status = paid?.toLocaleLowerCase();
    return status === ESubscriptionStatusEnum.Active.toLocaleLowerCase()
        || status === ESubscriptionStatusEnum.Trialing.toLocaleLowerCase();
}

export default function UserProfile({
    user,
    logout,
    subscribe,
    cancel,
    paid,
    cancelAtPeriodEnd,
    currentPeriodEnd,
}: TProfileParams) {
    const {
        confirmCancelOpen,
        reasonStepOpen,
        cancelReason,
        setCancelReason,
        openCancelFlow,
        closeCancelFlow,
        proceedToReason,
        submitCancel,
    } = useCancelSubscription(cancel);
    const subscribed = isSubscribed(paid);
    const cancelDate = currentPeriodEnd
        ? new Date(currentPeriodEnd).toLocaleDateString()
        : null;

    return (
        <div className='row'>
            <div className='d-flex justify-content-end'><img src={barbell} width={"50vw"} /></div>
            <div className="col d-flex flex-column mt-5 justify-content-between align-items-center text-center">
                <h1 className='mb-5'>Hello {user?.given_name || user?.name}</h1>
                {subscribed ?
                    <>
                        <p>You are subscribed monthly.</p>
                        {cancelAtPeriodEnd ? (
                            <p>
                                {cancelDate
                                    ? `Your subscription cancels on ${cancelDate}.`
                                    : "Your subscription is set to cancel at the end of the billing period."}
                            </p>
                        ) : (
                            <button
                                className="btn btn-outline-danger align-self-center mt-3"
                                onClick={openCancelFlow}
                            >
                                Cancel subscription
                            </button>
                        )}
                    </>
                    :
                    <button className="btn btn-success text-white align-self-center mt-5" onClick={() => subscribe()}>subscribe</button>
                }
                <button className="btn btn-lift text-white align-self-center mt-5" onClick={() => logout()}>Sign Out</button>
            </div>

            {confirmCancelOpen &&
                <dialog open className="border border-3 border-danger">
                    <div className="text-center">
                        <p>Cancel your subscription?</p>
                        <p>
                            {cancelDate
                                ? `You'll keep access until ${cancelDate}.`
                                : "You'll keep access until the end of the current billing period."}
                        </p>
                    </div>
                    <div className="d-flex justify-content-around">
                        <button className="btn btn-lift btn-sm" onClick={closeCancelFlow}>Keep subscription</button>
                        <button className="btn btn-danger btn-sm" onClick={proceedToReason}>Yes, cancel</button>
                    </div>
                </dialog>
            }

            {reasonStepOpen &&
                <dialog open className="border border-3 border-danger">
                    <div className="text-center mb-3">
                        <p>Want to tell us why? (optional)</p>
                        <textarea
                            className="form-control"
                            rows={4}
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder="Your feedback helps improve the app"
                        />
                    </div>
                    <div className="d-flex justify-content-around">
                        <button className="btn btn-lift btn-sm" onClick={closeCancelFlow}>Keep subscription</button>
                        <button className="btn btn-danger btn-sm" onClick={submitCancel}>Confirm cancellation</button>
                    </div>
                </dialog>
            }
        </div>
    );
}
