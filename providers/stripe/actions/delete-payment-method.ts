"use server"
import { NextResponse } from 'next/server'
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function DELETE(request: { customerId: any; paymentMethodId: string }) {
    const { customerId, paymentMethodId } = await request.json()
    try {
        // detach from customer
        await stripe.paymentMethods.detach(paymentMethodId)
        return NextResponse.json({ success: true })
    } catch (err: never) {
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 }
        )
    }
}
