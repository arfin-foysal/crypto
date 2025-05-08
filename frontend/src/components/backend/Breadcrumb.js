"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

const Breadcrumb = () => {
  const pathname = usePathname();

  // Skip the first slash and split the path into segments
  const pathSegments = pathname.split("/").filter((segment) => segment);

  // Create a mapping of path segments to more readable names
  const pathNames = {
    dashboard: "Dashboard",
    transactions: "Transactions",
    withdraw: "Withdraw",
    bank: "Bank Account",
    address: "Crypto Address",
    profile: "Profile",
    settings: "Settings",
  };

  // Function to build the path for each breadcrumb segment
  const getPathFromSegments = (segments, index) => {
    return "/" + segments.slice(0, index + 1).join("/");
  };

  return (
    <nav className="flex py-4" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        {/* Home icon - always present */}
        <li className="inline-flex items-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm inter font-medium text-[#BAB8B9] hover:text-white transition-colors duration-200"
          >
            <svg
              width={20}
              height={17}
              className="me-2"
              viewBox="0 0 20 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.75 15.25H17.5V9.62496L17.6828 9.80777C17.8003 9.92505 17.9596 9.99085 18.1256 9.9907C18.2916 9.99055 18.4507 9.92447 18.568 9.80699C18.6852 9.68951 18.751 9.53025 18.7509 9.36425C18.7508 9.19825 18.6847 9.03911 18.5672 8.92183L10.8836 1.24058C10.6492 1.00634 10.3314 0.874756 10 0.874756C9.66862 0.874756 9.3508 1.00634 9.11641 1.24058L1.43281 8.92183C1.31564 9.03911 1.24986 9.19813 1.24993 9.36391C1.25 9.52969 1.31593 9.68865 1.4332 9.80582C1.55048 9.92299 1.7095 9.98877 1.87528 9.9887C2.04106 9.98863 2.20002 9.9227 2.31719 9.80543L2.5 9.62496V15.25H1.25C1.08424 15.25 0.925268 15.3158 0.808058 15.433C0.690848 15.5502 0.625 15.7092 0.625 15.875C0.625 16.0407 0.690848 16.1997 0.808058 16.3169C0.925268 16.4341 1.08424 16.5 1.25 16.5H18.75C18.9158 16.5 19.0747 16.4341 19.1919 16.3169C19.3092 16.1997 19.375 16.0407 19.375 15.875C19.375 15.7092 19.3092 15.5502 19.1919 15.433C19.0747 15.3158 18.9158 15.25 18.75 15.25ZM3.75 8.37496L10 2.12496L16.25 8.37496V15.25H12.5V10.875C12.5 10.7092 12.4342 10.5502 12.3169 10.433C12.1997 10.3158 12.0408 10.25 11.875 10.25H8.125C7.95924 10.25 7.80027 10.3158 7.68306 10.433C7.56585 10.5502 7.5 10.7092 7.5 10.875V15.25H3.75V8.37496ZM11.25 15.25H8.75V11.5H11.25V15.25Z"
                fill="currentColor"
              />
            </svg>
          </Link>
        </li>

        {/* Dynamic breadcrumb segments */}
        {pathSegments.map((segment, index) => {
          const path = getPathFromSegments(pathSegments, index);
          const isLast = index === pathSegments.length - 1;

          return (
            <li key={path}>
              <div className="flex items-center">
                <span className="mx-auto text-[#BAB8B9]">/</span>
                {isLast ? (
                  <span className="ms-1 inter text-sm font-medium text-white md:ms-2">
                    {pathNames[segment] ||
                      segment.charAt(0).toUpperCase() + segment.slice(1)}
                  </span>
                ) : (
                  <Link
                    href={path}
                    className="ms-1 inter text-sm font-medium text-[#BAB8B9] hover:text-white transition-colors duration-200 md:ms-2"
                  >
                    {pathNames[segment] ||
                      segment.charAt(0).toUpperCase() + segment.slice(1)}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
