"use client";

import React, { createContext, useContext, useState } from "react";

interface AdminContextType {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
}

const AdminContext = createContext<AdminContextType>({
  mobileMenuOpen: false,
  setMobileMenuOpen: () => {},
  openMobileMenu: () => {},
  closeMobileMenu: () => {},
});

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <AdminContext.Provider
      value={{
        mobileMenuOpen,
        setMobileMenuOpen,
        openMobileMenu: () => setMobileMenuOpen(true),
        closeMobileMenu: () => setMobileMenuOpen(false),
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
