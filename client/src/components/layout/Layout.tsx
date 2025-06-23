
import { useIsMobile } from "@/hooks/use-mobile";
import { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
  noPadding?: boolean;
}

export default function Layout({ children, noPadding = false }: LayoutProps) {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F2FCE2]/30 to-neutral-50">
      <Header />
      {!isMobile && <Sidebar />}
      <main className={`${noPadding ? 'pt-16' : 'pt-16'} ${!isMobile ? 'pl-64' : ''}`}>
        <div className={`container ${noPadding ? 'p-0 max-w-full' : 'p-6'} mx-auto`}>
          {children}
        </div>
      </main>
    </div>
  );
}
