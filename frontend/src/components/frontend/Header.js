import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Header = ({ openAuthModal }) => {
  const router = useRouter();

  const handleLaunchApp = () => {
    // Only run this code on the client side
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        // If token exists, redirect to dashboard
        router.push("/dashboard");
      } else {
        // If no token, open the login modal
        openAuthModal();
      }
    }
  };

  return (
    <>
      <nav className="w-full z-20 start-0 border-b-[0.5px] border-[#FFFFFF59] drop-shadow-[#000000A6] drop-shadow-sm">
        <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto py-6 px-4">
          <a
            href=""
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <Image
              src="/assets/frontend_assets/site_logo.svg"
              alt="Qacent Logo"
              width={150}
              height={40}
              className=""
            />
          </a>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <button
              onClick={handleLaunchApp}
              type="button"
              className="text-white bg-gradient-to-r from-[#69E1A4] to-[#648A3A] inter font-semibold min-w-[180px] rounded-full text-base px-4 py-2 text-center cursor-pointer"
            >
              Launch app
            </button>
            <button
              data-collapse-toggle="navbar-sticky"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              aria-controls="navbar-sticky"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>
          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-sticky"
          >
            <ul className="flex flex-col p-4 md:p-0 mt-4 text-[#777576] rounded-lg text-base font-semibold md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 inter ">
              <li>
                <a
                  href="#"
                  className="block py-2 px-3  rounded-sm md:p-0 "
                  aria-current="page"
                >
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="block py-2 px-3 md:p-0">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="block py-2 px-3 md:p-0">
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="block py-2 px-3 md:p-0">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
