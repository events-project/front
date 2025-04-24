import BreadcrumbNav from "@/components/breadcrumb-nav";
import SideBar from "@/components/side-bar";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import MainClientProvider from "@/providers/main-client";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MainClientProvider>
      <SidebarProvider className="gap-4">
        <SideBar />
        <main className="flex flex-col w-full">
          <header
            className={cn(
              "h-[4rem]",
              "items-center",
              "flex",
              "w-full",
              "gap-2"
            )}
          >
            <SidebarTrigger className="cursor-pointer" />
            <Separator orientation="vertical" className="mr-2 max-h-8" />
            <BreadcrumbNav />
          </header>
          {children}
        </main>
      </SidebarProvider>
    </MainClientProvider>
  );
}
