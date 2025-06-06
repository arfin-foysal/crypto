import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigation } from "@/context/NavigationContext";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const { setSidebarNavigation } = useNavigation();

  // Custom navigation handler for sidebar links
  const handleNavigation = (path) => {
    // Only trigger navigation if not already on the path
    if (pathname !== path) {
      setSidebarNavigation(true);
      router.push(path);
    }
  };

  return (
    <>
      {/* Left Sidebar */}
      <div className="w-[200px] px-2 inter fixed top-24">
        <nav className="space-y-2">
          <div
            onClick={() => handleNavigation("/dashboard")}
            className={`group flex items-center space-x-3 font-semibold rounded-lg p-3 text-white transition-all duration-300 ease-in-out cursor-pointer ${
              pathname === "/dashboard"
                ? "bg-[#FFFFFF1A] border-l-4 border-[#69E1A4]"
                : "hover:bg-[#FFFFFF0D] hover:border-l-4 hover:border-[#69E1A4] hover:scale-[1.02] hover:shadow-md"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-[#69E1A4] group-hover:text-white transition-colors duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
            <span>Dashboard</span>
          </div>
          <div
            onClick={() => handleNavigation("/transactions")}
            className={`group flex items-center space-x-3 font-semibold rounded-lg p-3 text-white transition-all duration-300 ease-in-out cursor-pointer ${
              pathname === "/transactions"
                ? "bg-[#FFFFFF1A] border-l-4 border-[#69E1A4]"
                : "hover:bg-[#FFFFFF0D] hover:border-l-4 hover:border-[#69E1A4] hover:scale-[1.02] hover:shadow-md"
            }`}
          >
            <svg
              width={17}
              height={17}
              viewBox="0 0 17 17"
              className="group-hover:text-[#69E1A4] transition-colors duration-300"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.72">
                <path
                  d="M11 8.91638C11 9.41084 10.8534 9.89418 10.5787 10.3053C10.304 10.7164 9.91352 11.0369 9.45671 11.2261C8.99989 11.4153 8.49723 11.4648 8.01227 11.3683C7.52732 11.2719 7.08186 11.0338 6.73223 10.6841C6.3826 10.3345 6.1445 9.88906 6.04804 9.40411C5.95157 8.91916 6.00108 8.41649 6.1903 7.95967C6.37952 7.50286 6.69995 7.11241 7.11107 6.83771C7.5222 6.563 8.00555 6.41638 8.5 6.41638C9.16304 6.41638 9.79893 6.67977 10.2678 7.14861C10.7366 7.61746 11 8.25334 11 8.91638ZM16 4.91638V12.9164C16 13.049 15.9473 13.1762 15.8536 13.2699C15.7598 13.3637 15.6326 13.4164 15.5 13.4164H1.5C1.36739 13.4164 1.24021 13.3637 1.14645 13.2699C1.05268 13.1762 1 13.049 1 12.9164V4.91638C1 4.78377 1.05268 4.6566 1.14645 4.56283C1.24021 4.46906 1.36739 4.41638 1.5 4.41638H15.5C15.6326 4.41638 15.7598 4.46906 15.8536 4.56283C15.9473 4.6566 16 4.78377 16 4.91638ZM15 7.81326C14.4323 7.64539 13.9155 7.33814 13.4969 6.9195C13.0782 6.50086 12.771 5.98413 12.6031 5.41638H4.39687C4.229 5.98413 3.92175 6.50086 3.50311 6.9195C3.08447 7.33814 2.56775 7.64539 2 7.81326V10.0195C2.56775 10.1874 3.08447 10.4946 3.50311 10.9133C3.92175 11.3319 4.229 11.8486 4.39687 12.4164H12.6031C12.771 11.8486 13.0782 11.3319 13.4969 10.9133C13.9155 10.4946 14.4323 10.1874 15 10.0195V7.81326Z"
                  fill="white"
                />
              </g>
            </svg>

            <span>Transaction</span>
          </div>
          <div
            onClick={() => handleNavigation("/withdraw")}
            className={`group flex items-center space-x-3 font-semibold rounded-lg p-3 text-white transition-all duration-300 ease-in-out cursor-pointer ${
              pathname === "/withdraw"
                ? "bg-[#FFFFFF1A] border-l-4 border-[#69E1A4]"
                : "hover:bg-[#FFFFFF0D] hover:border-l-4 hover:border-[#69E1A4] hover:scale-[1.02] hover:shadow-md"
            }`}
          >
            <svg
              width={17}
              height={17}
              viewBox="0 0 17 17"
              className="group-hover:text-[#69E1A4] transition-colors duration-300"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.72" clipPath="url(#clip0_126_18)">
                <path
                  d="M14.8956 9.73263C14.7096 9.58935 14.4931 9.49095 14.2628 9.44509C14.0326 9.39924 13.7948 9.40716 13.5681 9.46826L10.9531 10.0695C11.014 9.8125 11.0158 9.54506 10.9586 9.28723C10.9014 9.02939 10.7866 8.78785 10.6227 8.58071C10.4589 8.37357 10.2503 8.20621 10.0125 8.09116C9.7748 7.9761 9.51411 7.91635 9.25 7.91638H6.12125C5.8585 7.91572 5.59822 7.96714 5.35546 8.06766C5.11269 8.16817 4.89225 8.3158 4.70687 8.50201L3.29312 9.91638H1.5C1.23478 9.91638 0.98043 10.0217 0.792893 10.2093C0.605357 10.3968 0.5 10.6512 0.5 10.9164L0.5 13.4164C0.5 13.6816 0.605357 13.936 0.792893 14.1235C0.98043 14.311 1.23478 14.4164 1.5 14.4164H8C8.04088 14.4164 8.08161 14.4114 8.12125 14.4014L12.1213 13.4014C12.1467 13.3953 12.1716 13.3869 12.1956 13.3764L14.625 12.3426L14.6525 12.3301C14.886 12.2135 15.0859 12.0393 15.2335 11.824C15.381 11.6087 15.4713 11.3594 15.4959 11.0995C15.5205 10.8397 15.4785 10.5778 15.3739 10.3387C15.2693 10.0996 15.1056 9.891 14.8981 9.73263H14.8956ZM14.2144 11.4295L11.8394 12.4408L7.9375 13.4164H4V10.6233L5.41437 9.20951C5.5069 9.11624 5.61703 9.0423 5.73839 8.99198C5.85974 8.94166 5.98988 8.91596 6.12125 8.91638H9.25C9.44891 8.91638 9.63968 8.9954 9.78033 9.13605C9.92098 9.2767 10 9.46747 10 9.66638C10 9.86529 9.92098 10.0561 9.78033 10.1967C9.63968 10.3374 9.44891 10.4164 9.25 10.4164H7.5C7.36739 10.4164 7.24021 10.4691 7.14645 10.5628C7.05268 10.6566 7 10.7838 7 10.9164C7 11.049 7.05268 11.1762 7.14645 11.2699C7.24021 11.3637 7.36739 11.4164 7.5 11.4164H9.5C9.53763 11.4163 9.57514 11.4121 9.61187 11.4039L13.7994 10.4408L13.8188 10.4358C13.9466 10.4003 14.083 10.4133 14.2018 10.4724C14.3206 10.5314 14.4134 10.6323 14.4622 10.7557C14.5111 10.879 14.5126 11.0161 14.4665 11.1405C14.4204 11.2649 14.3299 11.3678 14.2125 11.4295H14.2144ZM10.1462 5.77013C10.0524 5.67631 9.99972 5.54906 9.99972 5.41638C9.99972 5.2837 10.0524 5.15645 10.1462 5.06263C10.2401 4.96881 10.3673 4.9161 10.5 4.9161C10.6327 4.9161 10.7599 4.96881 10.8538 5.06263L12 6.20951V2.41638C12 2.28377 12.0527 2.1566 12.1464 2.06283C12.2402 1.96906 12.3674 1.91638 12.5 1.91638C12.6326 1.91638 12.7598 1.96906 12.8536 2.06283C12.9473 2.1566 13 2.28377 13 2.41638V6.20951L14.1462 5.06263C14.2401 4.96881 14.3673 4.9161 14.5 4.9161C14.6327 4.9161 14.7599 4.96881 14.8538 5.06263C14.9476 5.15645 15.0003 5.2837 15.0003 5.41638C15.0003 5.54906 14.9476 5.67631 14.8538 5.77013L12.8538 7.77013C12.8073 7.81662 12.7522 7.8535 12.6915 7.87866C12.6308 7.90382 12.5657 7.91678 12.5 7.91678C12.4343 7.91678 12.3692 7.90382 12.3085 7.87866C12.2478 7.8535 12.1927 7.81662 12.1462 7.77013L10.1462 5.77013Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_126_18">
                  <rect
                    width={16}
                    height={16}
                    fill="white"
                    transform="translate(0.5 0.916382)"
                  />
                </clipPath>
              </defs>
            </svg>

            <span>Withdraw</span>
          </div>
          <div
            onClick={() => handleNavigation("/bank")}
            className={`group flex items-center space-x-3 font-semibold rounded-lg p-3 text-white transition-all duration-300 ease-in-out cursor-pointer ${
              pathname === "/bank"
                ? "bg-[#FFFFFF1A] border-l-4 border-[#69E1A4]"
                : "hover:bg-[#FFFFFF0D] hover:border-l-4 hover:border-[#69E1A4] hover:scale-[1.02] hover:shadow-md"
            }`}
          >
            <svg
              width={16}
              height={17}
              viewBox="0 0 16 17"
              className="group-hover:text-[#69E1A4] transition-colors duration-300"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.72">
                <path
                  d="M15.5 13.9163C15.5 14.0489 15.4473 14.1761 15.3536 14.2699C15.2598 14.3637 15.1326 14.4163 15 14.4163H1C0.867392 14.4163 0.740215 14.3637 0.646447 14.2699C0.552678 14.1761 0.5 14.0489 0.5 13.9163C0.5 13.7837 0.552678 13.6565 0.646447 13.5628C0.740215 13.469 0.867392 13.4163 1 13.4163H15C15.1326 13.4163 15.2598 13.469 15.3536 13.5628C15.4473 13.6565 15.5 13.7837 15.5 13.9163ZM1.01875 7.05258C0.989011 6.94772 0.994349 6.83602 1.03395 6.73448C1.07355 6.63294 1.14525 6.54712 1.23812 6.49008L7.73812 2.49008C7.81689 2.44165 7.90754 2.41602 8 2.41602C8.09246 2.41602 8.18311 2.44165 8.26188 2.49008L14.7619 6.49008C14.8548 6.54705 14.9265 6.63281 14.9662 6.73431C15.0059 6.83581 15.0113 6.94749 14.9817 7.05236C14.952 7.15723 14.8889 7.24954 14.802 7.31524C14.715 7.38094 14.609 7.41644 14.5 7.41633H13V11.4163H14C14.1326 11.4163 14.2598 11.469 14.3536 11.5628C14.4473 11.6565 14.5 11.7837 14.5 11.9163C14.5 12.0489 14.4473 12.1761 14.3536 12.2699C14.2598 12.3637 14.1326 12.4163 14 12.4163H2C1.86739 12.4163 1.74021 12.3637 1.64645 12.2699C1.55268 12.1761 1.5 12.0489 1.5 11.9163C1.5 11.7837 1.55268 11.6565 1.64645 11.5628C1.74021 11.469 1.86739 11.4163 2 11.4163H3V7.41633H1.5C1.39112 7.41637 1.2852 7.38086 1.19834 7.31521C1.11148 7.24955 1.04842 7.15734 1.01875 7.05258ZM9 10.9163C9 11.0489 9.05268 11.1761 9.14645 11.2699C9.24021 11.3637 9.36739 11.4163 9.5 11.4163C9.63261 11.4163 9.75979 11.3637 9.85355 11.2699C9.94732 11.1761 10 11.0489 10 10.9163V7.91633C10 7.78372 9.94732 7.65654 9.85355 7.56278C9.75979 7.46901 9.63261 7.41633 9.5 7.41633C9.36739 7.41633 9.24021 7.46901 9.14645 7.56278C9.05268 7.65654 9 7.78372 9 7.91633V10.9163ZM6 10.9163C6 11.0489 6.05268 11.1761 6.14645 11.2699C6.24021 11.3637 6.36739 11.4163 6.5 11.4163C6.63261 11.4163 6.75979 11.3637 6.85355 11.2699C6.94732 11.1761 7 11.0489 7 10.9163V7.91633C7 7.78372 6.94732 7.65654 6.85355 7.56278C6.75979 7.46901 6.63261 7.41633 6.5 7.41633C6.36739 7.41633 6.24021 7.46901 6.14645 7.56278C6.05268 7.65654 6 7.78372 6 7.91633V10.9163Z"
                  fill="white"
                />
              </g>
            </svg>

            <span>Bank Details</span>
          </div>
          <div
            onClick={() => handleNavigation("/address")}
            className={`group flex items-center space-x-3 font-semibold rounded-lg p-3 text-white transition-all duration-300 ease-in-out cursor-pointer ${
              pathname === "/address"
                ? "bg-[#FFFFFF1A] border-l-4 border-[#69E1A4]"
                : "hover:bg-[#FFFFFF0D] hover:border-l-4 hover:border-[#69E1A4] hover:scale-[1.02] hover:shadow-md"
            }`}
          >
            <svg
              width={16}
              height={17}
              viewBox="0 0 16 17"
              className="group-hover:text-[#69E1A4] transition-colors duration-300"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.72">
                <path
                  d="M11 10.4164C11 10.6816 10.8946 10.936 10.7071 11.1235C10.5196 11.311 10.2652 11.4164 10 11.4164H7V9.41638H10C10.2652 9.41638 10.5196 9.52174 10.7071 9.70928C10.8946 9.89681 11 10.1512 11 10.4164ZM15 8.91638C15 10.202 14.6188 11.4587 13.9046 12.5276C13.1903 13.5965 12.1752 14.4296 10.9874 14.9216C9.79973 15.4136 8.49279 15.5423 7.23192 15.2915C5.97104 15.0407 4.81285 14.4216 3.90381 13.5126C2.99477 12.6035 2.3757 11.4453 2.1249 10.1845C1.87409 8.92359 2.00282 7.61666 2.49479 6.42894C2.98676 5.24122 3.81988 4.22606 4.8888 3.51183C5.95772 2.7976 7.21442 2.41638 8.5 2.41638C10.2234 2.4182 11.8756 3.10361 13.0942 4.3222C14.3128 5.54079 14.9982 7.19303 15 8.91638ZM12 10.4164C12 10.0714 11.9107 9.73225 11.7408 9.43196C11.5709 9.13166 11.3263 8.88042 11.0306 8.70263C11.2482 8.44394 11.3966 8.13432 11.4621 7.80271C11.5276 7.47109 11.5079 7.1283 11.405 6.80633C11.302 6.48437 11.1192 6.19375 10.8735 5.96161C10.6278 5.72947 10.3273 5.56339 10 5.47888V4.91638C10 4.78377 9.94732 4.6566 9.85356 4.56283C9.75979 4.46906 9.63261 4.41638 9.5 4.41638C9.36739 4.41638 9.24022 4.46906 9.14645 4.56283C9.05268 4.6566 9 4.78377 9 4.91638V5.41638H8V4.91638C8 4.78377 7.94732 4.6566 7.85356 4.56283C7.75979 4.46906 7.63261 4.41638 7.5 4.41638C7.36739 4.41638 7.24022 4.46906 7.14645 4.56283C7.05268 4.6566 7 4.78377 7 4.91638V5.41638H6C5.86739 5.41638 5.74022 5.46906 5.64645 5.56283C5.55268 5.6566 5.5 5.78377 5.5 5.91638C5.5 6.04899 5.55268 6.17617 5.64645 6.26994C5.74022 6.3637 5.86739 6.41638 6 6.41638V11.4164C5.86739 11.4164 5.74022 11.4691 5.64645 11.5628C5.55268 11.6566 5.5 11.7838 5.5 11.9164C5.5 12.049 5.55268 12.1762 5.64645 12.2699C5.74022 12.3637 5.86739 12.4164 6 12.4164H7V12.9164C7 13.049 7.05268 13.1762 7.14645 13.2699C7.24022 13.3637 7.36739 13.4164 7.5 13.4164C7.63261 13.4164 7.75979 13.3637 7.85356 13.2699C7.94732 13.1762 8 13.049 8 12.9164V12.4164H9V12.9164C9 13.049 9.05268 13.1762 9.14645 13.2699C9.24022 13.3637 9.36739 13.4164 9.5 13.4164C9.63261 13.4164 9.75979 13.3637 9.85356 13.2699C9.94732 13.1762 10 13.049 10 12.9164V12.4164C10.5304 12.4164 11.0391 12.2057 11.4142 11.8306C11.7893 11.4555 12 10.9468 12 10.4164ZM10.5 7.41638C10.5 7.15117 10.3946 6.89681 10.2071 6.70928C10.0196 6.52174 9.76522 6.41638 9.5 6.41638H7V8.41638H9.5C9.76522 8.41638 10.0196 8.31102 10.2071 8.12349C10.3946 7.93595 10.5 7.6816 10.5 7.41638Z"
                  fill="white"
                />
              </g>
            </svg>

            <span>Crypto Address</span>
          </div>
          <button
            onClick={logout}
            className="group flex items-center space-x-3 font-semibold rounded-lg p-3 text-white hover:bg-[#FFFFFF0D] hover:border-l-4 hover:border-[#FF6B6B] hover:scale-[1.02] hover:shadow-md w-full text-left cursor-pointer transition-all duration-300 ease-in-out"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="text-white group-hover:text-[#FF6B6B] transition-colors duration-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>

            <span>Logout</span>
          </button>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
