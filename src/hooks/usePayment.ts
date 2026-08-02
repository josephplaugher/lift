import { useEffect, useState } from "react";
import useGetToken from "./useGetToken";
import ApiUrl from "../utilities/ApiUrl";
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { ESubscriptionStatusEnum } from "../interfaces/ISubscriptionStatus.enum";

const stripePromise = loadStripe(import.meta.env.VITE_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function usePayment(userId: string) {
    const token = useGetToken();
    const [status, setStatus] = useState<ESubscriptionStatusEnum | null>(null);
    const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(false);
    const [currentPeriodEnd, setCurrentPeriodEnd] = useState<string | null>(null);

    useEffect(() => {
        verifyPaymentStatus(userId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    async function verifyPaymentStatus(userId: string) {
        const stripe = await stripePromise as Stripe | null;
        if (!stripe) return;

        const result = await fetch(`${ApiUrl()}/api/payment/status?sub=${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                "Accept": "application/json",
            }
        })
        const paymentStatus = await result.json();
        setStatus(paymentStatus.status);
        setCancelAtPeriodEnd(!!paymentStatus.cancelAtPeriodEnd);
        setCurrentPeriodEnd(paymentStatus.currentPeriodEnd ?? null);
    }

    async function subscribe() {
        const stripe = await stripePromise as Stripe | null;
        if (!stripe) return;

        const sessionId = await fetch(`${ApiUrl()}/api/payment/session`, {
            method: 'POST',
            body: JSON.stringify({ userId }),
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                "Accept": "application/json",
            }
        })
        const { url } = await sessionId.json();
        window.location.href = url;
    }

    async function cancel(cancelReason?: string) {
        const stripe = await stripePromise as Stripe | null;
        if (!stripe) return;

        const result = await fetch(`${ApiUrl()}/api/payment/cancel`, {
            method: 'POST',
            body: JSON.stringify({ userId, cancelReason }),
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                "Accept": "application/json",
            }
        })
        const paymentStatus = await result.json();
        if (paymentStatus.status) {
            setStatus(paymentStatus.status);
            setCancelAtPeriodEnd(!!paymentStatus.cancelAtPeriodEnd);
            setCurrentPeriodEnd(paymentStatus.currentPeriodEnd ?? null);
        }
    }

    return { subscribe, cancel, paid: status, cancelAtPeriodEnd, currentPeriodEnd };
}
