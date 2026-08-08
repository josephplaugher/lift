import { FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useProfileContext } from "../hooks/ProfileContext";
import { LoadingIndicator } from "../components/StatusIndicators";
import barbell from "../images/barbell.svg";

export default function CompleteProfile() {
    const { profile, loading, saveFullName } = useProfileContext();
    const navigate = useNavigate();
    const [fullName, setFullName] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (loading) return <LoadingIndicator />;
    if (profile && !profile.emailVerified) {
        return <Navigate to="/verify-email" replace />;
    }
    if (profile?.profileComplete) {
        return <Navigate to="/" replace />;
    }

    async function onSubmit(e: FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            await saveFullName(fullName);
            navigate("/", { replace: true });
        } catch {
            setError("Could not save your name. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="d-flex flex-column justify-content-center align-items-center text-center vh-100 px-3">
            <div className="d-flex justify-content-end w-100"><img src={barbell} width="50" alt="" /></div>
            <h1 className="mb-3">Complete your profile</h1>
            <p className="mb-4">What should we call you?</p>
            <form className="w-100" style={{ maxWidth: 420 }} onSubmit={onSubmit}>
                <input
                    className="form-control mb-3"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full name"
                    required
                    autoFocus
                />
                {error && <p className="text-danger">{error}</p>}
                <button
                    className="btn btn-lift text-white w-100 p-3"
                    type="submit"
                    disabled={submitting || !fullName.trim()}
                >
                    {submitting ? "Saving..." : "Continue"}
                </button>
            </form>
        </div>
    );
}
