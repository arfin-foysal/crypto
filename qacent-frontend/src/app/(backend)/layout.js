"use client";

import Navbar from "@/components/backend/Navbar";
import Sidebar from "@/components/backend/Sidebar";
import ProtectedRoute from "@/components/common/ProtectedRoute";

export default function Layout({ children }) {
  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4">
        <Navbar />
        <div className="flex min-h-[calc(100vh-92px)] space-x-8 mt-5">
          <div className="z-50 w-52">
            <Sidebar />
          </div>
          {/* Main Content */}
          <main className="flex-1 flex flex-col h-full">
            <div className=" transition-all ease-in-out duration-300 rounded-xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
