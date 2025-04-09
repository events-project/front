import StripeProvider from "@/providers/stripe/stripe-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <StripeProvider>{children}</StripeProvider>;
}
