"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

const Login = ({ handleOpenSignUp, onClose }) => {
  const handleClose = () => {
    if (typeof onClose === "function") {
      onClose();
    }
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { login, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await login(email, password);
      if (response) {
        toast.success("Login successful");
      } else {
        // Display the backend error message directly
        // Prioritize the 'errors' field which contains the specific error message
        if (error && typeof error === "object") {
          // Check if the error object has the exact format from your backend
          if (error.errors) {
            // This is the specific error message we want to show
            // e.g., "Invalid credentials: User not found"
            toast.error(error.errors);
            setErrorMessage(error.errors);
          } else if (error.message) {
            // Fallback to message if errors is not available
            toast.error(error.message);
            setErrorMessage(error.message);
          } else {
            // Last resort fallback
            toast.error("Login failed");
            setErrorMessage("Login failed. Please check your credentials.");
          }
        } else {
          // If error is a string or undefined
          toast.error(error || "Login failed");
          setErrorMessage(error || "Please check your credentials.");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("An unexpected error occurred");
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-[484px] w-full px-8 mx-auto bg-[#141913] rounded-[20px] p-8 relative text-white        mt-12 ">
        <div className="w-full mt-4 ">
          <button
            className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white absolute top-4 right-4 cursor-pointer"
            onClick={handleClose}
          >
            <svg
              width={24}
              height={24}
              viewBox="0 0 24 24"
              className="text-white"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.6">
                <path
                  d="M19.5469 17.9541C19.7582 18.1654 19.8769 18.4521 19.8769 18.751C19.8769 19.0499 19.7582 19.3365 19.5469 19.5479C19.3355 19.7592 19.0489 19.8779 18.75 19.8779C18.4511 19.8779 18.1645 19.7592 17.9531 19.5479L12.0009 13.5938L6.04687 19.546C5.83553 19.7573 5.54888 19.8761 5.25 19.8761C4.95111 19.8761 4.66447 19.7573 4.45312 19.546C4.24178 19.3346 4.12305 19.048 4.12305 18.7491C4.12305 18.4502 4.24178 18.1636 4.45312 17.9522L10.4072 12L4.455 6.04598C4.24365 5.83464 4.12492 5.54799 4.12492 5.2491C4.12492 4.95022 4.24365 4.66357 4.455 4.45223C4.66634 4.24089 4.95299 4.12215 5.25187 4.12215C5.55076 4.12215 5.8374 4.24089 6.04875 4.45223L12.0009 10.4063L17.955 4.45129C18.1663 4.23995 18.453 4.12122 18.7519 4.12122C19.0508 4.12122 19.3374 4.23995 19.5487 4.45129C19.7601 4.66264 19.8788 4.94928 19.8788 5.24817C19.8788 5.54705 19.7601 5.8337 19.5487 6.04504L13.5947 12L19.5469 17.9541Z"
                  fill="currentColor"
                />
              </g>
            </svg>
          </button>
        </div>
        <div className="w-full">
          <h2 className="text-center text-white text-2xl/9 font-bold tracking-tight">
            Sign in
          </h2>
        </div>
        <div className="mt-5 w-full">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="email"
                  className="block text-base inter font-semibold tracking-[-0.08px] text-white"
                >
                  Email
                </label>
              </div>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-white/40"
                    width={16}
                    height={16}
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M14.95 3.684L8.637 8.912C8.45761 9.06063 8.23196 9.14196 7.999 9.14196C7.76604 9.14196 7.54039 9.06063 7.361 8.912L1.051 3.684C1.01714 3.78591 0.999922 3.89261 1 4V12C1 12.2652 1.10536 12.5196 1.29289 12.7071C1.48043 12.8946 1.73478 13 2 13H14C14.2652 13 14.5196 12.8946 14.7071 12.7071C14.8946 12.5196 15 12.2652 15 12V4C15.0004 3.89267 14.9835 3.78597 14.95 3.684ZM2 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V12C16 12.5304 15.7893 13.0391 15.4142 13.4142C15.0391 13.7893 14.5304 14 14 14H2C1.46957 14 0.960859 13.7893 0.585786 13.4142C0.210714 13.0391 0 12.5304 0 12V4C0 3.46957 0.210714 2.96086 0.585786 2.58579C0.960859 2.21071 1.46957 2 2 2ZM1.79 3L7.366 7.603C7.54459 7.7505 7.76884 7.83144 8.00046 7.83199C8.23209 7.83254 8.45672 7.75266 8.636 7.606L14.268 3H1.79Z"
                      fill="#777576"
                    />
                  </svg>
                </div>

                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md px-3 py-3 text-base text-white border border-[#868685] outline-0 placeholder:text-white/40 sm:text-sm/6 ps-10 inter font-normal"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-base inter font-semibold tracking-[-0.08px] text-white"
                >
                  Password
                </label>
              </div>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-white/40"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.5 7C3.36739 7 3.24021 7.05268 3.14645 7.14645C3.05268 7.24021 3 7.36739 3 7.5V13.5C3 13.6326 3.05268 13.7598 3.14645 13.8536C3.24021 13.9473 3.36739 14 3.5 14H12.5C12.6326 14 12.7598 13.9473 12.8536 13.8536C12.9473 13.7598 13 13.6326 13 13.5V7.5C13 7.36739 12.9473 7.24021 12.8536 7.14645C12.7598 7.05268 12.6326 7 12.5 7H3.5ZM3.5 6H12.5C12.8978 6 13.2794 6.15804 13.5607 6.43934C13.842 6.72064 14 7.10218 14 7.5V13.5C14 13.8978 13.842 14.2794 13.5607 14.5607C13.2794 14.842 12.8978 15 12.5 15H3.5C3.10218 15 2.72064 14.842 2.43934 14.5607C2.15804 14.2794 2 13.8978 2 13.5V7.5C2 7.10218 2.15804 6.72064 2.43934 6.43934C2.72064 6.15804 3.10218 6 3.5 6Z"
                      fill="#777576"
                    />
                    <path
                      d="M8 8.5C8.13261 8.5 8.25979 8.55268 8.35355 8.64645C8.44732 8.74021 8.5 8.86739 8.5 9V12C8.5 12.1326 8.44732 12.2598 8.35355 12.3536C8.25979 12.4473 8.13261 12.5 8 12.5C7.86739 12.5 7.74021 12.4473 7.64645 12.3536C7.55268 12.2598 7.5 12.1326 7.5 12V9C7.5 8.86739 7.55268 8.74021 7.64645 8.64645C7.74021 8.55268 7.86739 8.5 8 8.5ZM11 6V5C11 4.20435 10.6839 3.44129 10.1213 2.87868C9.55871 2.31607 8.79565 2 8 2C7.20435 2 6.44129 2.31607 5.87868 2.87868C5.31607 3.44129 5 4.20435 5 5V6H11ZM8 1C9.06087 1 10.0783 1.42143 10.8284 2.17157C11.5786 2.92172 12 3.93913 12 5V7H4V5C4 3.93913 4.42143 2.92172 5.17157 2.17157C5.92172 1.42143 6.93913 1 8 1Z"
                      fill="#777576"
                    />
                  </svg>
                </div>

                <input
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="current-password"
                  required
                  placeholder="Enter your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md px-3 py-3 text-base text-white border border-[#868685] outline-0 placeholder:text-white/40 sm:text-sm/6 ps-10 inter font-normal"
                />
              </div>
              <div className="text-sm text-end mt-2">
                <a href="#" className="font-semibold text-[#868685] inter">
                  Forgot password?
                </a>
              </div>
            </div>
            {errorMessage && (
              <div className="text-red-500 text-sm">{errorMessage}</div>
            )}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex font-semibold inter text-base w-full justify-center rounded-lg bg-[#648A3A] px-3 py-3 tracking-[-0.18px] text-white shadow-xs cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Continue"
                )}
              </button>
            </div>
          </form>
          <div className="max-w-lg mx-auto px-4 mt-5">
            <div className="flex items-center space-x-4">
              <span className="block w-full h-[1px] bg-[#868685]"></span>
              <span className="text-[#868685] inter font-normal text-sm">
                Or
              </span>
              <span className="block w-full h-[1px] bg-[#868685]"></span>
            </div>
          </div>

          <div className="my-5">
            <button
              type="submit"
              className="flex font-semibold inter text-base w-full justify-center rounded-lg border border-[#868685] px-3 py-3 tracking-[-0.18px] text-white shadow-xs mb-5 cursor-pointer"
            >
              <svg
                width={20}
                height={20}
                className="mr-2"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_561_852)">
                  <path
                    d="M6.96721 0.658267C4.9689 1.3515 3.24556 2.66728 2.05032 4.41233C0.855082 6.15739 0.250946 8.23974 0.326651 10.3535C0.402355 12.4673 1.15391 14.5011 2.47092 16.1562C3.78794 17.8113 5.60099 19.0004 7.64377 19.5489C9.2999 19.9762 11.035 19.995 12.7 19.6036C14.2083 19.2648 15.6028 18.5401 16.7469 17.5005C17.9376 16.3854 18.802 14.9668 19.2469 13.3973C19.7305 11.6906 19.8166 9.89566 19.4985 8.15045H10.1985V12.0083H15.5844C15.4768 12.6236 15.2461 13.2108 14.9062 13.7349C14.5663 14.2589 14.1242 14.7091 13.6063 15.0583C12.9486 15.4933 12.2072 15.786 11.4297 15.9176C10.6499 16.0626 9.85011 16.0626 9.07033 15.9176C8.28 15.7542 7.53236 15.428 6.87502 14.9598C5.819 14.2123 5.02608 13.1503 4.6094 11.9255C4.18567 10.6776 4.18567 9.32484 4.6094 8.07702C4.906 7.20235 5.39632 6.40598 6.04377 5.74733C6.7847 4.97975 7.72273 4.43108 8.75495 4.16151C9.78718 3.89195 10.8737 3.91191 11.8953 4.2192C12.6934 4.46419 13.4232 4.89223 14.0266 5.4692C14.6339 4.86504 15.2401 4.25931 15.8453 3.65202C16.1578 3.32545 16.4985 3.01452 16.8063 2.68014C15.8853 1.82307 14.8042 1.15617 13.625 0.717642C11.4777 -0.0620611 9.12811 -0.0830148 6.96721 0.658267Z"
                    fill="white"
                  />
                  <path
                    d="M6.96563 0.657073C9.12635 -0.0847125 11.4759 -0.0643102 13.6234 0.714886C14.8028 1.15639 15.8834 1.82651 16.8031 2.68676C16.4906 3.02114 16.1609 3.33364 15.8422 3.65864C15.2359 4.26384 14.6302 4.86697 14.025 5.46801C13.4216 4.89104 12.6918 4.463 11.8937 4.21801C10.8725 3.90964 9.78597 3.88852 8.75347 4.15698C7.72097 4.42544 6.78236 4.97311 6.04062 5.73989C5.39318 6.39854 4.90285 7.19491 4.60625 8.06957L1.36719 5.56176C2.52658 3.26264 4.53398 1.50399 6.96563 0.657073Z"
                    fill="#E33629"
                  />
                  <path
                    d="M0.510152 8.04688C0.684247 7.18405 0.973283 6.34848 1.36953 5.5625L4.60859 8.07656C4.18486 9.32438 4.18486 10.6772 4.60859 11.925C3.52942 12.7583 2.44974 13.5958 1.36953 14.4375C0.377575 12.463 0.0750466 10.2133 0.510152 8.04688Z"
                    fill="#F8BD00"
                  />
                  <path
                    d="M10.196 8.14844H19.496C19.8141 9.89365 19.7281 11.6885 19.2444 13.3953C18.7995 14.9648 17.9352 16.3834 16.7444 17.4984C15.6991 16.6828 14.6491 15.8734 13.6038 15.0578C14.1221 14.7082 14.5644 14.2576 14.9043 13.733C15.2442 13.2084 15.4747 12.6205 15.5819 12.0047H10.196C10.1944 10.7203 10.196 9.43437 10.196 8.14844Z"
                    fill="#587DBD"
                  />
                  <path
                    d="M1.36719 14.4383C2.4474 13.6049 3.52708 12.7674 4.60625 11.9258C5.02376 13.1511 5.81782 14.2131 6.875 14.9602C7.53439 15.4262 8.28364 15.7497 9.075 15.9102C9.85478 16.0551 10.6546 16.0551 11.4344 15.9102C12.2119 15.7785 12.9533 15.4858 13.6109 15.0508C14.6562 15.8664 15.7063 16.6758 16.7516 17.4914C15.6076 18.5316 14.2132 19.2568 12.7047 19.5961C11.0397 19.9875 9.30457 19.9687 7.64844 19.5414C6.3386 19.1917 5.11512 18.5751 4.05469 17.7305C2.93228 16.8394 2.01556 15.7164 1.36719 14.4383Z"
                    fill="#319F43"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_561_852">
                    <rect width={20} height={20} fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Google
            </button>
            <button
              type="submit"
              className="flex font-semibold inter text-base w-full justify-center rounded-lg px-3 py-3 border border-[#868685]  tracking-[-0.18px] text-white shadow-xs cursor-pointer"
            >
              <svg
                width={20}
                height={20}
                className="mr-2"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_561_861)">
                  <path
                    d="M15.459 10.6263C15.434 8.09375 17.524 6.87875 17.6177 6.81875C16.4427 5.1 14.6127 4.86375 13.9602 4.8375C12.4027 4.68 10.9215 5.755 10.1302 5.755C9.34147 5.755 8.12147 4.86125 6.83022 4.885C5.13272 4.91 3.56772 5.8725 2.69272 7.3925C0.928972 10.4525 2.24147 14.9875 3.96022 17.4688C4.80022 18.6838 5.80147 20.0487 7.11647 20C8.38272 19.95 8.86147 19.18 10.3927 19.18C11.924 19.18 12.354 20 13.694 19.9738C15.0565 19.9487 15.9202 18.735 16.754 17.5162C17.719 16.1062 18.1152 14.7425 18.139 14.6725C18.109 14.6587 15.4815 13.6525 15.4552 10.6275L15.459 10.6263ZM12.9415 3.19375C13.639 2.3475 14.1102 1.1725 13.9815 0C12.9765 0.04125 11.7577 0.67 11.0365 1.515C10.389 2.265 9.82272 3.46125 9.97397 4.61C11.0965 4.6975 12.2427 4.04 12.9402 3.195L12.9415 3.19375Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_561_861">
                    <rect width={20} height={20} fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Apple{" "}
            </button>
          </div>
          <p className=" text-center font-semibold inter text-white text-base tracking-[-0.18px]">
            Don&apos;t have an account?{" "}
            <button
              onClick={handleOpenSignUp}
              type="button"
              className="font-semibold text-[#648A3A] cursor-pointer"
            >
              Sign up.
            </button>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
