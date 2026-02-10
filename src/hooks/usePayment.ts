import { useEffect, useMemo, useState } from "react";
import useGetToken from "./useGetToken";
import ApiUrl from "../utilities/ApiUrl";
import { loadStripe, Stripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function usePayment(userId: string) {
    const token = useGetToken();

    async function subscribe() {
        const stripe = await stripePromise as Stripe | null;
        if (!stripe) return;

        const sessionId = await fetch(`${ApiUrl()}/api/payment/session`, {
            method: 'POST',
            body: JSON.stringify({userId}),
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                "Accept": "application/json",
            }
        })
        const { url } = await sessionId.json();
        window.location.href = url;
    }

    return subscribe;
}