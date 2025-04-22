"use client"

import PaymentMethodsManager from "@/components/payment-list"
import PaymentForm from "@/components/payment-form"
import { CreditCard, Wallet } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shared/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


export default function PaymentSection() {
    return ( <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Payment Methods</h1>

        {/* Desktop view: Side by side */}
        <div className="hidden md:flex gap-8">
            <Card className="flex-1 border shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                        <Wallet className="h-5 w-5" />
                        Saved Payment Methods
                    </CardTitle>
                    <CardDescription>View and manage your saved payment methods</CardDescription>
                </CardHeader>
                <CardContent>
                    <PaymentMethodsManager />
                </CardContent>
            </Card>

            <Card className="flex-1 border shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Add Payment Method
                    </CardTitle>
                    <CardDescription>Add a new credit card or payment method</CardDescription>
                </CardHeader>
                <CardContent>
                    <PaymentForm />
                </CardContent>
            </Card>
        </div>

        {/* Mobile view: Tabs */}
        <div className="md:hidden">
            <Tabs defaultValue="saved" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="saved">Saved Methods</TabsTrigger>
                    <TabsTrigger value="add">Add New</TabsTrigger>
                </TabsList>
                <Card className="border shadow-sm">
                    <TabsContent value="saved" className="m-0">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2">
                                <Wallet className="h-5 w-5" />
                                Saved Payment Methods
                            </CardTitle>
                            <CardDescription>View and manage your saved payment methods</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <PaymentMethodsManager />
                        </CardContent>
                    </TabsContent>
                    <TabsContent value="add" className="m-0">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Add Payment Method
                            </CardTitle>
                            <CardDescription>Add a new credit card or payment method</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <PaymentForm />
                        </CardContent>
                    </TabsContent>
                </Card>
            </Tabs>
        </div>
    </div>
    )
}
