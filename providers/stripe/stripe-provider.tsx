"use client";

import { Elements } from "@stripe/react-stripe-js";
import { getClientSecret } from "./get-secret";
import React, { memo, useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {getAccountId} from "@/features/stripe-payment-intent/actions";

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

type Props = {
    children: React.ReactNode;
};



const StripeProvider = ({ children }: Props) => {
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        // Replace "yourAccountId" with the actual value or metadata lookup
        const accountData = await getAccountId({ id: "123" });
        const secret = await getClientSecret(accountData.stripeId);
        setClientSecret(secret);
      } catch (error) {
        console.error("Error fetching client secret:", error);
      }
    };

    fetchClientSecret();
    }, []);

    if (!clientSecret) return null;

    return (
        <Elements
            stripe={stripePromise}
            options={{
                clientSecret,
            }}
        >
            {children}
        </Elements>
    );
};
export default memo(StripeProvider);