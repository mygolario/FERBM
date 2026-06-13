import React from "react";
import { StoreProvider } from "@/context/StoreContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContactBar } from "@/components/shared/ContactBar";
import { CartDrawer } from "@/components/cart/CartDrawer";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <div className="relative flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        <ContactBar />
        <CartDrawer />
      </div>
    </StoreProvider>
  );
}
