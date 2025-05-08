"use client";
import AuthModal from "@/components/frontend/AuthModal";
import Footer from "@/components/frontend/Footer";
import Header from "@/components/frontend/Header";
import { useState } from "react";

export default function Layout({ children }) {
  let [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AuthModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <Header openAuthModal={() => setIsOpen(true)} />
      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <div className=" transition-all ease-in-out duration-300 rounded-xl">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
