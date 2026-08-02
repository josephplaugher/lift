import { useState } from "react";

export default function useCancelSubscription(cancel: (cancelReason?: string) => void) {
    const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
    const [reasonStepOpen, setReasonStepOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState("");

    function openCancelFlow() {
        setConfirmCancelOpen(true);
    }

    function closeCancelFlow() {
        setConfirmCancelOpen(false);
        setReasonStepOpen(false);
        setCancelReason("");
    }

    function proceedToReason() {
        setConfirmCancelOpen(false);
        setReasonStepOpen(true);
    }

    function submitCancel() {
        cancel(cancelReason.trim() || undefined);
        closeCancelFlow();
    }

    return {
        confirmCancelOpen,
        reasonStepOpen,
        cancelReason,
        setCancelReason,
        openCancelFlow,
        closeCancelFlow,
        proceedToReason,
        submitCancel,
    };
}
