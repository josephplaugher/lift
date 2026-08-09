import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useProfileContext } from "../hooks/ProfileContext";
import { LoadingIndicator } from "../components/StatusIndicators";
import ApiUrl from "../utilities/ApiUrl";
import { FetchPost } from "../utilities/Fetch";
import barbell from "../images/barbell.svg";

/**
 * Resend goes through our API → Auth0 Management API
 * (POST /api/v2/jobs/verification-email).
 *
 * email_verified only updates on a fresh ID token. Silent renewal needs a refresh
 * token (offline_access + "Allow Offline Access" on the API); when that is
 * unavailable the SDK falls back to an /authorize iframe, which Firefox and Safari
 * block as third-party. A full-page redirect is first-party, so it always works and
 * reuses the existing Auth0 session without prompting for credentials.
 */
export default function VerifyEmail() {
    const { user, getAccessTokenSilently, getIdTokenClaims, loginWithRedirect, logout } = useAuth0();
    const { profile, loading, refreshProfile } = useProfileContext();
    const [checking, setChecking] = useState(false);
    const [resending, setResending] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [messageTone, setMessageTone] = useState<"warning" | "success">("warning");

    if (loading) return <LoadingIndicator />;
    if (user?.email_verified || profile?.emailVerified) {
        return <Navigate to={profile?.profileComplete ? "/" : "/complete-profile"} replace />;
    }

    async function checkVerification() {
        setChecking(true);
        setMessage(null);
        try {
            await getAccessTokenSilently({
                cacheMode: "off",
                authorizationParams: { audience: ApiUrl() },
            });
            const claims = await getIdTokenClaims();
            if (claims?.email_verified) {
                await refreshProfile();
                // Full reload so Auth0Provider rehydrates the updated claims,
                // then OnboardingGate routes to the right next step.
                window.location.assign("/");
                return;
            }
            // Silent renewal worked, so this is a definitive answer.
            setMessageTone("warning");
            setMessage(
                "Still not verified. Open the link in your email, then check again."
            );
            setChecking(false);
        } catch (e) {
            console.warn("Silent session refresh failed, falling back to redirect", e);
            // No definitive answer — round-trip through Auth0 to get fresh claims.
            await loginWithRedirect({ appState: { returnTo: "/" } });
        }
    }

    async function resendVerification() {
        setResending(true);
        setMessage(null);
        try {
            const token = await getAccessTokenSilently({
                authorizationParams: { audience: ApiUrl() },
            });
            const response = await FetchPost("user/resend-verification", {}, token);
            const data = await response.json();
            if (data.alreadyVerified) {
                setMessageTone("success");
                setMessage("Your email is already verified. Sign in again to continue.");
                return;
            }
            if (!response.ok || data.sent !== true) {
                const errMsg = Array.isArray(data?.message) ? data.message.join(", ") : data?.message;
                throw new Error(errMsg || "Failed to resend");
            }
            setMessageTone("success");
            setMessage(
                data.email
                    ? `Verification email sent to ${data.email}. Check inbox and spam.`
                    : "Verification email sent. Check your inbox and spam."
            );
        } catch {
            setMessageTone("warning");
            setMessage("Could not resend the verification email. Try again in a moment.");
        } finally {
            setResending(false);
        }
    }

    async function reLogin() {
        await loginWithRedirect({
            authorizationParams: {
                prompt: "login",
                audience: ApiUrl(),
                scope: "openid profile email offline_access",
            },
        });
    }

    return (
        <div className="d-flex flex-column justify-content-center align-items-center text-center vh-100 px-3">
            <div className="d-flex justify-content-end w-100"><img src={barbell} width="50" alt="" /></div>
            <h1 className="mb-3">Verify your email</h1>
            <p className="mb-2">
                We sent a verification link to <strong>{user?.email}</strong>.
            </p>
            <p className="mb-4 text-muted">
                Open the link, then come back here and check your status.
            </p>
            {message && (
                <p className={`mb-3 ${messageTone === "success" ? "text-success" : "text-warning"}`}>
                    {message}
                </p>
            )}
            <button
                className="btn btn-lift text-white align-self-center mb-2 p-3"
                onClick={checkVerification}
                disabled={checking || resending}
            >
                {checking ? "Checking..." : "I've verified — check again"}
            </button>
            <button
                className="btn btn-lift text-white align-self-center mb-2 p-3"
                onClick={resendVerification}
                disabled={checking || resending}
            >
                {resending ? "Sending..." : "Resend verification email"}
            </button>
            <button
                className="btn btn-lift text-white align-self-center mb-2 p-3"
                onClick={reLogin}
                disabled={checking || resending}
            >
                Sign in again
            </button>
            <button
                className="btn btn-outline-secondary align-self-center mb-2 p-3"
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            >
                Sign out
            </button>
        </div>
    );
}
