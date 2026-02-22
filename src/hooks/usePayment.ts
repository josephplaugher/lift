import { useEffect, useState } from "react";
import useGetToken from "./useGetToken";
import ApiUrl from "../utilities/ApiUrl";
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { ESubscriptionStatusEnum } from "../interfaces/ISubscriptionStatus.enum";

const stripePromise = loadStripe(import.meta.env.VITE_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function usePayment(userId: string) {
    const token = useGetToken();
    const [status, setStatus] = useState<ESubscriptionStatusEnum | null>(null);

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
        const isPaid = await result.json();
        console.log("result, ", result)
        console.log("ispaid: ", isPaid)
        setStatus(isPaid.status);
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

    return { subscribe, paid: status };
}