import StripeProvider from "@/providers/stripe/stripe-provider";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Payment Form",
    description: "Complete your payment securely using Stripe",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen bg-gray-50">
            <StripeProvider>{children}</StripeProvider>
        </div>
    );
}