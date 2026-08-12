import { User } from '@auth0/auth0-react';
import { useState } from 'react';
import { ESubscriptionStatusEnum } from '../interfaces/ISubscriptionStatus.enum';
import useCancelSubscription from '../hooks/useCancelSubscription';
import { useProfileContext } from '../hooks/ProfileContext';
import useRestTimerSettings from '../hooks/useRestTimerSettings';
import useInstallPrompt from '../hooks/useInstallPrompt';
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
    const { profile } = useProfileContext();
    const {
        durationSeconds,
        autoStart,
        muteChime,
        setDurationSeconds,
        setAutoStart,
        setMuteChime,
    } = useRestTimerSettings();
    const { canInstall, showIosHint, install, installed } = useInstallPrompt();
    // Draft string so clearing the field while typing doesn't snap back to 90.
    const [durationDraft, setDurationDraft] = useState(String(durationSeconds));
    const subscribed = isSubscribed(paid);
    const cancelDate = currentPeriodEnd
        ? new Date(currentPeriodEnd).toLocaleDateString()
        : null;
    const firstName = profile?.fullName?.trim().split(/\s+/)[0]
        || user?.given_name
        || user?.name;

    return (
        <div className='row'>
            <div className='d-flex justify-content-between align-items-center px-3 pt-2'>
                <button className="btn btn-lift text-white" onClick={() => logout()}>Sign Out</button>
                <img src={barbell} width={"50vw"} alt="" />
            </div>
            <div className="col d-flex flex-column mt-5 align-items-center text-center" style={{ minHeight: "70vh" }}>
                <h1 className='mb-5'>Hello {firstName}</h1>

                <section className="w-100 px-4 text-start" aria-labelledby="settings-heading">
                    <h2 id="settings-heading" className="h4 mb-3 text-center">Settings</h2>
                    <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
                        <label htmlFor="rest-timer-duration" className="form-label mb-0">Rest timer (seconds)</label>
                        <input
                            id="rest-timer-duration"
                            type="number"
                            className="form-control"
                            style={{ width: "5.5rem" }}
                            min={1}
                            step={1}
                            value={durationDraft}
                            onChange={(e) => {
                                const next = e.target.value;
                                setDurationDraft(next);
                                const parsed = parseInt(next, 10);
                                if (Number.isFinite(parsed) && parsed > 0) {
                                    setDurationSeconds(parsed);
                                }
                            }}
                            onBlur={() => {
                                const parsed = parseInt(durationDraft, 10);
                                if (Number.isFinite(parsed) && parsed > 0) {
                                    setDurationSeconds(parsed);
                                    setDurationDraft(String(parsed));
                                } else {
                                    setDurationDraft(String(durationSeconds));
                                }
                            }}
                            inputMode="numeric"
                            pattern="\d*"
                        />
                    </div>
                    <div className="form-check form-switch d-flex align-items-center justify-content-between ps-0 mb-3">
                        <label className="form-check-label" htmlFor="rest-timer-mute">Mute timer chime</label>
                        <input
                            id="rest-timer-mute"
                            className="form-check-input ms-2"
                            type="checkbox"
                            role="switch"
                            checked={muteChime}
                            onChange={(e) => setMuteChime(e.target.checked)}
                        />
                    </div>
                    <div className="form-check form-switch d-flex align-items-center justify-content-between ps-0 mb-1">
                        <label className="form-check-label" htmlFor="rest-timer-auto">Auto-start rest timer</label>
                        <input
                            id="rest-timer-auto"
                            className="form-check-input ms-2"
                            type="checkbox"
                            role="switch"
                            checked={autoStart}
                            onChange={(e) => setAutoStart(e.target.checked)}
                        />
                    </div>
                    <p className="text-muted small fst-italic mb-0">
                        Auto opens the timer after you enter reps; otherwise use the clock button on Lift.
                    </p>

                    {!installed && (canInstall || showIosHint) &&
                        <div className="mt-4 pt-3 border-top">
                            <h3 className="h6 mb-2">Add to Home Screen</h3>
                            {canInstall &&
                                <button type="button" className="btn btn-lift text-white w-100 p-3" onClick={() => void install()}>
                                    Install Lift
                                </button>
                            }
                            {showIosHint &&
                                <p className="text-muted small mb-0">
                                    iPhone: open this site in <strong>Safari</strong>, tap the Share button, then <strong>Add to Home Screen</strong>. Chrome on iOS cannot install apps.
                                </p>
                            }
                        </div>
                    }
                </section>

                <div className="mt-auto mb-4">
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
                        <button className="btn btn-success text-white align-self-center" onClick={() => subscribe()}>subscribe</button>
                    }
                </div>
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
