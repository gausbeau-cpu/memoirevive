"use client";

import React from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { AdminProvider, useAdmin } from "@/components/admin/AdminContext";

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { mobileMenuOpen, closeMobileMenu } = useAdmin();
  const isLoginPage = pathname === "/wendclass/login";

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-[#150F1B] text-[#F5F0FA] flex flex-col justify-center selection:bg-brand-purple/30 selection:text-white">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#150F1B] text-[#F5F0FA] flex overflow-x-hidden selection:bg-brand-purple/30 selection:text-white">
      {/* Desktop Sidebar */}
      <div className="hidden md:block shrink-0 sticky top-0 h-screen">
        <AdminSidebar />
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={closeMobileMenu}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 transform transition-transform duration-200 ease-in-out md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AdminSidebar onCloseMobile={closeMobileMenu} />
      </div>

      {/* Main App Page Content */}
      <div className="flex-1 flex flex-col min-w-0">{children}</div>
    </div>
  );
}

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminProvider>
  );
}
