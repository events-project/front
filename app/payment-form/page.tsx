import { PaymentForm } from "@/components/payment-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Page() {
    return (
        <div className="container max-w-2xl py-8">
            <Card>
                <CardHeader>
                    <CardTitle>Payment Details</CardTitle>
                    <CardDescription>
                        Enter your payment information to complete your purchase
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <PaymentForm />
                </CardContent>
            </Card>
        </div>
    );
}