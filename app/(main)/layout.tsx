import Navbar from "@/components/nav-bar";
import MainClientProvider from "@/providers/main-client";
export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <MainClientProvider>
        <Navbar />
        <main>{children}</main>
      </MainClientProvider>
    </>
  );
}
