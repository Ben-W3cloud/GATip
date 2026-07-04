import { Header } from "./Header";
import { Toaster } from "@/components/ui/toaster";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Header />
      <main className="min-h-screen w-full overflow-x-hidden pt-16 lg:pl-64">
        {children}
      </main>
      <Toaster />
    </div>
  );
}
