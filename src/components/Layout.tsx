
import React, { ReactNode } from "react";
import Navbar from "./Navbar";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container py-8 px-4 md:px-0">
        {children}
      </main>
      <Toaster />
      <Sonner />
    </div>
  );
};

export default Layout;
