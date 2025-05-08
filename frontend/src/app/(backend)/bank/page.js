"use client";
import Image from "next/image";
import React, { useState, useEffect, Suspense } from "react";
import apiService from "@/services/api";
import toast from "react-hot-toast";
import Breadcrumb from "@/components/backend/Breadcrumb";
import SimpleLoader from "@/components/common/SimpleLoader";
import { useSearchParams } from "next/navigation";

// Create a client component that uses useSearchParams
const SearchParamsHandler = () => {
  const searchParams = useSearchParams();
  // You can use searchParams here if needed
  return null;
};

const Bank = () => {
  const [bankAccount, setBankAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contents, setContents] = useState({});
  const [isContentLoading, setIsContentLoading] = useState(true);

  // Function to copy text to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast.error("Failed to copy to clipboard");
      });
  };

  // Copy all bank details to clipboard
  const copyAllDetails = () => {
    if (!bankAccount) return;

    const details = [
      `Account Holder: ${bankAccount?.user?.full_name || "N/A"}`,
      `Bank Name: ${bankAccount?.bank?.name || "N/A"}`,
      `Routing No: ${bankAccount?.bank?.ach_routing_no || "N/A"}, ${
        bankAccount?.bank?.wire_routing_no || "N/A"
      }`,
      `Account No: ${bankAccount?.account_number || "N/A"}`,
      `Account Type: ${bankAccount?.bank?.account_type || "N/A"}`,
      `Bank Address: ${bankAccount?.bank?.address || "N/A"}`,
      `Currency: ${bankAccount?.bank?.currency?.code || "N/A"}`,
    ].join("\n");

    copyToClipboard(details);
  };

  // Function to fetch content from API
  const fetchContent = async () => {
    setIsContentLoading(true);
    try {
      const response = await apiService.getContentByIds("1,2,3");
      if (response.status && response.data) {
        // The API returns data in the format { data: { "Content Name": { ... } } }
        setContents(response.data);
        console.log("Content loaded:", response.data);
      } else {
        console.error("Failed to fetch content");
      }
    } catch (err) {
      console.error("Error fetching content:", err);
    } finally {
      setIsContentLoading(false);
    }
  };

  // Fetch bank account details and content
  useEffect(() => {
    const fetchBankAccount = async () => {
      setIsLoading(true);
      try {
        const response = await apiService.getBankAccount();
        if (response.status && response.data) {
          setBankAccount(response.data);
        } else {
          setError("Failed to fetch bank account details");
        }
      } catch (err) {
        console.error("Error fetching bank account:", err);
        setError("An error occurred while fetching bank account details");
        toast.error("Failed to load bank account details");
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch both bank account and content in parallel
    fetchBankAccount();
    fetchContent();
  }, []);
  return (
    <>
      {/* Wrap useSearchParams in Suspense */}
      <Suspense fallback={null}>
        <SearchParamsHandler />
      </Suspense>
      <div className="w-full px-2 mt-4 md:mt-0">
        <Breadcrumb />
        <div className="bg-gradient-to-b from-[#9EDA581A] via-[#68DB9F1A] to-[#2020201A] rounded-[32px] p-8 border border-[#3B3B3B]">
          <div className="mb-5">
            <h2 className="text-xl font-semibold inter text-white mb-1">
              Bank details{" "}
            </h2>
            <p className="text-xs font-semibold inter text-[#777576]">
              Details information of your bank account{" "}
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#648A3A]"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">{error}</div>
          ) : (
            <div className="mx-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="">
                  <div className="mb-2">
                    <p className="workSans text-[11px] text-[#FFFFFF80] font-normal mb-2">
                      Account Holder Name{" "}
                    </p>
                    <div className="text-[13px] font-medium workSans text-white">
                      {bankAccount?.user?.full_name || "N/A"}
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="workSans text-[11px] text-[#FFFFFF80] font-normal mb-2">
                      Routing No.
                    </div>
                    <div className="text-[13px] font-medium workSans text-white">
                      <span>
                        ACH: {bankAccount?.bank?.ach_routing_no || "N/A"}
                      </span>

                      <span className="ml-5">
                        {" "}
                        WIRE: {bankAccount?.bank?.wire_routing_no || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="workSans text-[11px] text-[#FFFFFF80] font-normal mb-2">
                      Account Type
                    </div>
                    <div className="text-[13px] font-medium workSans text-white">
                      {bankAccount?.bank?.account_type || "N/A"}
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="workSans text-[11px] text-[#FFFFFF80] font-normal mb-2">
                      Currency Type{" "}
                    </div>
                    <div className="text-[13px] font-medium workSans text-white">
                      {bankAccount?.bank?.currency?.code || "N/A"}{" "}
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <button
                    onClick={copyAllDetails}
                    className="absolute top-0 right-0 cursor-pointer flex items-center inter font-semibold text-sm font-font-semibold text-[#FFFFFF] bg-[#FFFFFF0D] px-5 py-2 rounded-full border border-[#FFFFFF14] hover:bg-[#FFFFFF1A] transition-colors"
                  >
                    Copy details
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                  <div className="mb-2">
                    <p className="workSans text-[11px] text-[#FFFFFF80] font-normal mb-2">
                      Bank Name
                    </p>
                    <div className="text-[13px] font-medium workSans text-white">
                      {bankAccount?.bank?.name || "N/A"}
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="workSans text-[11px] text-[#FFFFFF80] font-normal mb-2">
                      Account No.
                    </div>
                    <div className="text-[13px] font-medium workSans text-white">
                      {bankAccount?.account_number || "N/A"}
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="workSans text-[11px] text-[#FFFFFF80] font-normal mb-2">
                      Bank Address
                    </div>
                    <div className="text-[13px] font-medium workSans text-white">
                      {bankAccount?.bank?.address || "N/A"}
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="workSans text-[11px] text-[#FFFFFF80] font-normal mb-2">
                      Account Status{" "}
                    </div>
                    <div className="text-[13px] font-medium workSans text-white">
                      {bankAccount?.is_open !== undefined ? (
                        bankAccount.is_open ? (
                          <span className="text-green-400">Active</span>
                        ) : (
                          <span className="text-yellow-400">Pending</span>
                        )
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="mt-5">
            <div className="grid grid-cols-2 gap-6">
              <div className="border border-[#68DDA4] rounded-2xl p-4">
                <div className="flex items-center mb-4 space-x-2">
                  <div className="w-8 h-8 border border-[#FFFFFF3D] flex items-center justify-center rounded-md">
                    <svg
                      width={16}
                      height={16}
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.375 2.62535C13.14 2.39035 13.14 2.01035 13.375 1.77785C13.61 1.54535 13.99 1.54285 14.2225 1.77785L15.8225 3.37785C15.935 3.49035 15.9975 3.64285 15.9975 3.80285C15.9975 3.96285 15.935 4.11535 15.8225 4.22785L14.2225 5.82785C13.9875 6.06285 13.6075 6.06285 13.375 5.82785C13.1425 5.59285 13.14 5.21285 13.375 4.98035L13.95 4.40535L9.6 4.40035C9.2675 4.40035 9 4.13285 9 3.80035C9 3.46785 9.2675 3.20035 9.6 3.20035H13.9525L13.375 2.62535ZM2.625 11.0254L2.05 11.6004H6.4C6.7325 11.6004 7 11.8679 7 12.2004C7 12.5329 6.7325 12.8004 6.4 12.8004H2.0475L2.6225 13.3754C2.8575 13.6104 2.8575 13.9904 2.6225 14.2229C2.3875 14.4554 2.0075 14.4579 1.775 14.2229L0.175 12.6254C0.0625 12.5129 0 12.3604 0 12.2004C0 12.0404 0.0625 11.8879 0.175 11.7754L1.775 10.1754C2.01 9.94035 2.39 9.94035 2.6225 10.1754C2.855 10.4104 2.8575 10.7904 2.6225 11.0229L2.625 11.0254ZM2.4 3.20035H8.4475C8.355 3.38035 8.3 3.58285 8.3 3.80035C8.3 4.51785 8.8825 5.10035 9.6 5.10035H12.535C12.435 5.52535 12.55 5.98785 12.88 6.32035C13.3875 6.82785 14.21 6.82785 14.7175 6.32035L15.2 5.83785V11.2004C15.2 12.0829 14.4825 12.8004 13.6 12.8004H7.5525C7.645 12.6204 7.7 12.4179 7.7 12.2004C7.7 11.4829 7.1175 10.9004 6.4 10.9004H3.465C3.565 10.4754 3.45 10.0129 3.12 9.68035C2.6125 9.17285 1.79 9.17285 1.2825 9.68035L0.8 10.1629V4.80035C0.8 3.91785 1.5175 3.20035 2.4 3.20035ZM4 4.80035H2.4V6.40035C3.2825 6.40035 4 5.68285 4 4.80035ZM13.6 9.60035C12.7175 9.60035 12 10.3179 12 11.2004H13.6V9.60035ZM8 10.4004C8.63652 10.4004 9.24697 10.1475 9.69706 9.69741C10.1471 9.24732 10.4 8.63687 10.4 8.00035C10.4 7.36383 10.1471 6.75338 9.69706 6.3033C9.24697 5.85321 8.63652 5.60035 8 5.60035C7.36348 5.60035 6.75303 5.85321 6.30294 6.3033C5.85286 6.75338 5.6 7.36383 5.6 8.00035C5.6 8.63687 5.85286 9.24732 6.30294 9.69741C6.75303 10.1475 7.36348 10.4004 8 10.4004Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  <p className="inter font-semibold text-base text-[#FFFBFD]">
                    {contents[0]?.name || "USD Transfers"}
                  </p>
                </div>
                {isContentLoading ? (
                  <div className="flex justify-center items-center py-4">
                    <SimpleLoader isLoading={true} size="medium" />
                  </div>
                ) : contents["USD Transfers"] ? (
                  <div
                    className="inter font-normal text-sm"
                    dangerouslySetInnerHTML={{
                      __html: contents["USD Transfers"].description,
                    }}
                  />
                ) : (
                  <div
                    className="inter font-normal text-sm"
                    dangerouslySetInnerHTML={{
                      __html: contents[0]?.description || "Content not found",
                    }}
                  />
                )}
              </div>{" "}
              <div className="border border-[#68DDA4] rounded-2xl p-4">
                <div className="flex items-center mb-4 space-x-2">
                  <div className="w-8 h-8 border border-[#FFFFFF3D] flex items-center justify-center rounded-md">
                    <svg
                      width={18}
                      height={16}
                      viewBox="0 0 18 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M4.99097 0C2.77702 0 0.982422 1.79077 0.982422 4V12C0.982422 14.2092 2.77702 16 4.99097 16H13.0081C15.222 16 17.0166 14.2092 17.0166 12V4C17.0166 1.79077 15.222 0 13.0081 0H4.99097ZM2.12823 4C2.12823 2.42215 3.40975 1.14339 4.99097 1.14339H13.0081C14.5893 1.14339 15.8708 2.42215 15.8708 4V12C15.8708 13.5778 14.5893 14.8566 13.0081 14.8566H4.99097C3.40975 14.8566 2.12823 13.5778 2.12823 12V4ZM9.21042 4.45046C9.13025 4.26584 8.8688 4.26584 8.78862 4.45046L7.8204 6.70523C7.7982 6.75815 7.75501 6.80123 7.70074 6.82461L5.44115 7.79077C5.25614 7.86954 5.25614 8.1317 5.44115 8.21047L7.70074 9.17661C7.75501 9.19999 7.7982 9.24308 7.8204 9.29723L8.78862 11.5508C8.8688 11.7366 9.13025 11.7366 9.21042 11.5508L10.1786 9.29723C10.2008 9.24308 10.244 9.19999 10.2983 9.17661L12.5579 8.21047C12.7429 8.1317 12.7429 7.86954 12.5579 7.79077L10.2983 6.82461C10.244 6.80123 10.2008 6.75815 10.1786 6.70523L9.21042 4.45046Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  <p className="inter font-semibold text-base text-[#FFFBFD]">
                    {contents[1]?.name || "Transaction Fee"}
                  </p>
                </div>
                {isContentLoading ? (
                  <div className="flex justify-center items-center py-4">
                    <SimpleLoader isLoading={true} size="medium" />
                  </div>
                ) : contents["Transaction Fee"] ? (
                  <div
                    className="inter font-normal text-sm"
                    dangerouslySetInnerHTML={{
                      __html: contents["Transaction Fee"].description,
                    }}
                  />
                ) : (
                  <div
                    className="inter font-normal text-sm"
                    dangerouslySetInnerHTML={{
                      __html: contents[1]?.description || "Content not found",
                    }}
                  />
                )}
              </div>
              <div className="col-span-2 border border-[#68DDA4] rounded-2xl p-4">
                <div className="max-w-3xl">
                  <div className="flex items-center mb-4 space-x-2">
                    <div className="w-8 h-8 border border-[#FFFFFF3D] flex items-center justify-center rounded-md">
                      <svg
                        width={16}
                        height={14}
                        viewBox="0 0 16 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.303 2.69524C11.9231 1.32352 10.064 0.541782 8.11844 0.51511C6.17288 0.488437 4.2931 1.21892 2.87605 2.55229C1.45899 3.88567 0.615599 5.71757 0.523956 7.66116C0.432313 9.60475 1.0996 11.5079 2.3849 12.9687L2.39052 12.9749C2.40084 12.9859 2.41052 12.9971 2.42177 13.0077C2.4449 13.034 2.47115 13.0637 2.50209 13.0946C2.62341 13.2236 2.77006 13.3261 2.93283 13.3958C3.09561 13.4655 3.27102 13.5008 3.44807 13.4996C3.62513 13.4983 3.80003 13.4606 3.96182 13.3886C4.12361 13.3167 4.26881 13.2121 4.38834 13.0815C4.84823 12.5817 5.40681 12.1827 6.02878 11.9098C6.65075 11.6369 7.32257 11.496 8.00177 11.496C8.68098 11.496 9.3528 11.6369 9.97477 11.9098C10.5967 12.1827 11.1553 12.5817 11.6152 13.0815C11.7356 13.2128 11.882 13.3177 12.045 13.3895C12.2081 13.4613 12.3843 13.4985 12.5625 13.4987C12.7406 13.4989 12.9169 13.462 13.0801 13.3905C13.2433 13.3191 13.3899 13.2145 13.5105 13.0834L13.6108 12.974L13.6165 12.9677C14.8829 11.5377 15.5557 9.67821 15.4977 7.76889C15.4396 5.85958 14.655 4.04442 13.304 2.69399L13.303 2.69524ZM7.4999 2.99993C7.4999 2.86732 7.55258 2.74014 7.64635 2.64638C7.74011 2.55261 7.86729 2.49993 7.9999 2.49993C8.13251 2.49993 8.25968 2.55261 8.35345 2.64638C8.44722 2.74014 8.4999 2.86732 8.4999 2.99993V3.99993C8.4999 4.13254 8.44722 4.25971 8.35345 4.35348C8.25968 4.44725 8.13251 4.49993 7.9999 4.49993C7.86729 4.49993 7.74011 4.44725 7.64635 4.35348C7.55258 4.25971 7.4999 4.13254 7.4999 3.99993V2.99993ZM3.9999 8.49993H2.9999C2.86729 8.49993 2.74011 8.44725 2.64635 8.35348C2.55258 8.25972 2.4999 8.13254 2.4999 7.99993C2.4999 7.86732 2.55258 7.74014 2.64635 7.64638C2.74011 7.55261 2.86729 7.49993 2.9999 7.49993H3.9999C4.13251 7.49993 4.25968 7.55261 4.35345 7.64638C4.44722 7.74014 4.4999 7.86732 4.4999 7.99993C4.4999 8.13254 4.44722 8.25972 4.35345 8.35348C4.25968 8.44725 4.13251 8.49993 3.9999 8.49993ZM5.5249 5.52493C5.43114 5.61863 5.30401 5.67126 5.17146 5.67126C5.03891 5.67126 4.91178 5.61863 4.81802 5.52493L4.11084 4.81805C4.01706 4.72428 3.96437 4.59708 3.96437 4.46446C3.96437 4.33184 4.01706 4.20465 4.11084 4.11087C4.20461 4.01709 4.33181 3.9644 4.46443 3.9644C4.59705 3.9644 4.72424 4.01709 4.81802 4.11087L5.5249 4.81805C5.6186 4.91181 5.67123 5.03894 5.67123 5.17149C5.67123 5.30404 5.6186 5.43117 5.5249 5.52493ZM10.1905 6.2468L8.70615 8.60618C8.64542 8.69034 8.57156 8.7642 8.4874 8.82493C8.28422 8.96667 8.03333 9.02257 7.78919 8.98048C7.54505 8.9384 7.32736 8.80173 7.18337 8.60013C7.03937 8.39854 6.98069 8.14829 7.02006 7.9037C7.05943 7.65911 7.19367 7.43991 7.39365 7.29368L9.75302 5.8093C9.80666 5.77192 9.87046 5.75188 9.93584 5.75188C10.0012 5.75188 10.065 5.77192 10.1186 5.8093C10.186 5.85793 10.2314 5.93125 10.2448 6.01323C10.2583 6.0952 10.2388 6.17918 10.1905 6.2468ZM11.1818 5.52493C11.0872 5.61474 10.9614 5.66407 10.831 5.6624C10.7006 5.66073 10.576 5.60819 10.4838 5.51599C10.3916 5.42379 10.3391 5.29922 10.3374 5.16884C10.3358 5.03846 10.3851 4.91259 10.4749 4.81805L11.1818 4.11087C11.2756 4.01709 11.4027 3.9644 11.5354 3.9644C11.668 3.9644 11.7952 4.01709 11.889 4.11087C11.9827 4.20465 12.0354 4.33184 12.0354 4.46446C12.0354 4.59708 11.9827 4.72428 11.889 4.81805L11.1818 5.52493ZM12.9999 8.49993H11.9999C11.8673 8.49993 11.7401 8.44725 11.6463 8.35348C11.5526 8.25972 11.4999 8.13254 11.4999 7.99993C11.4999 7.86732 11.5526 7.74014 11.6463 7.64638C11.7401 7.55261 11.8673 7.49993 11.9999 7.49993H12.9999C13.1325 7.49993 13.2597 7.55261 13.3535 7.64638C13.4472 7.74014 13.4999 7.86732 13.4999 7.99993C13.4999 8.13254 13.4472 8.25972 13.3535 8.35348C13.2597 8.44725 13.1325 8.49993 12.9999 8.49993Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                    <p className="inter font-semibold text-base text-[#FFFBFD]">
                      {contents[2]?.name || "Transaction Limits"}
                    </p>
                  </div>
                  {isContentLoading ? (
                    <div className="flex justify-center items-center py-4">
                      <SimpleLoader isLoading={true} size="medium" />
                    </div>
                  ) : contents["Transaction Limits"] ? (
                    <div
                      className="inter font-normal text-sm text-[#BAB8B9]"
                      dangerouslySetInnerHTML={{
                        __html: contents["Transaction Limits"].description,
                      }}
                    />
                  ) : (
                    <div
                      className="inter font-normal text-sm text-[#BAB8B9]"
                      dangerouslySetInnerHTML={{
                        __html: contents[2]?.description || "Content not found",
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Bank;
