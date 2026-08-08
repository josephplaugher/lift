import { Navigate, Outlet } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useProfileContext } from "../hooks/ProfileContext";
import { LoadingIndicator } from "./StatusIndicators";

/** Email verification first, then profile completion. No Auth0 sub-prefix branching. */
export default function OnboardingGate() {
    const { isAuthenticated, isLoading: authLoading } = useAuth0();
    const { profile, loading, error } = useProfileContext();

    if (authLoading || loading) {
        return <LoadingIndicator />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (error) {
        return (
            <div className="app-container">
                <div className="error-state">
                    <div className="error-title">Oops!</div>
                    <div className="error-message">{error}</div>
                </div>
            </div>
        );
    }

    if (profile && !profile.emailVerified) {
        return <Navigate to="/verify-email" replace />;
    }

    if (profile && !profile.profileComplete) {
        return <Navigate to="/complete-profile" replace />;
    }

    return <Outlet />;
}
