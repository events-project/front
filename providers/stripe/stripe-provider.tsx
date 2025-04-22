"use client";

import { Elements } from "@stripe/react-stripe-js";
import { getClientSecret } from "./actions/get-secret";
import React, { memo, useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "@clerk/nextjs";
import { getAccountId } from "@/actions/get-account-id";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

type Props = {
  children: React.ReactNode;
};

const StripeProvider = ({ children }: Props) => {
  const { orgId } = useAuth();
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    if (!orgId) return;
    const fetchClientSecret = async () => {
      try {
        const accountData = await getAccountId({ id: orgId || "" });
        const secret = await getClientSecret(accountData.stripeId);
        setClientSecret(secret);
      } catch (error) {
        console.error("Error fetching client secret:", error);
      }
    };

    fetchClientSecret();
  }, [orgId]);

  if (!clientSecret) return <></>;

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
