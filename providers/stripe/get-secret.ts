"use server";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const getClientSecret = async (customerId: string):Promise<string> => {
    const setupIntent = await stripe.setupIntents.create({
        customer: customerId,
        automatic_payment_methods: {
            enabled: true,
        },
    });
    if (!setupIntent.client_secret) throw new Error("Failed to create client secret");
    return setupIntent.client_secret;
};