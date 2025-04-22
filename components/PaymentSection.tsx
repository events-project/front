"use client"

import PaymentMethodsManager from "@/components/payment-list"
import PaymentForm from "@/components/payment-form"
import { CreditCard, Wallet } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shared/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shared/tabs"
import {Button} from "@/components/shared/button";
import {useState} from "react";
import { motion, AnimatePresence } from "framer-motion"


export default function PaymentSection() {
    const [showForm, setShowForm] = useState(false)


    return ( <div className="container mx-auto py-8 px-4">

        {/* Desktop view: Side by side */}
            <div className="hidden md:grid md:grid-cols-2 md:gap-8 items-start">
                <Card className="border shadow-sm self-start">
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

                <Card className="border shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Add Payment Method
                    </CardTitle>
                    <CardDescription>Add a new credit card or payment method</CardDescription>
                </CardHeader>
                <CardContent>
                    <AnimatePresence mode="wait">
                        {showForm ? (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <PaymentForm />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="button"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Button className="cursor-pointer" onClick={() => setShowForm(true)}>+ Add Payment Method</Button>
                            </motion.div>
                        )}
                    </AnimatePresence>

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
                <Card
                    className={`flex-1 border shadow-sm transition-all duration-500 ease-in-out ${
                        showForm ? "h-auto" : "h-[200px]"
                    }`}
                >                    <TabsContent value="saved" className="m-0">
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
                                    <CreditCard className="h-5 w-5"/>
                                    Add Payment Method
                                </CardTitle>
                                <CardDescription>Add a new credit card or payment method</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <PaymentForm/>
                            </CardContent>
                    </TabsContent>
                </Card>
            </Tabs>
        </div>
    </div>
)
}
