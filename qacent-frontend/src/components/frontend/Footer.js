import React from "react";
import Image from "next/image";

const Footer = () => {
  return (
    <>
      <footer className="b">
        <div className="mx-auto w-full max-w-7xl p-4 py-6 lg:py-8">
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-4">
            <div className="mb-6 md:mb-0">
              <a href="" className="flex items-center">
                <Image
                  src="/assets/frontend_assets/footer-logo.svg"
                  className="me-3"
                  alt="footer Logo"
                  width={150}
                  height={40}
                />
              </a>
              <div className="mt-4 flex items-center space-x-2">
                <svg
                  width={41}
                  height={40}
                  viewBox="0 0 41 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="0.5"
                    width={40}
                    height={40}
                    rx="6.4"
                    fill="white"
                    fillOpacity="0.08"
                  />
                  <path
                    d="M28.253 12.659C28.3395 12.5601 28.4056 12.4452 28.4477 12.3207C28.4897 12.1963 28.5069 12.0647 28.4981 11.9337C28.4893 11.8026 28.4548 11.6746 28.3965 11.5568C28.3383 11.4391 28.2574 11.334 28.1585 11.2475C28.0596 11.161 27.9447 11.0949 27.8202 11.0528C27.6958 11.0108 27.5642 10.9936 27.4332 11.0024C27.3021 11.0112 27.1741 11.0457 27.0563 11.104C26.9386 11.1622 26.8335 11.2431 26.747 11.342L21.637 17.182L17.3 11.4C17.2069 11.2758 17.0861 11.175 16.9472 11.1056C16.8084 11.0361 16.6552 11 16.5 11H12.5C12.3143 11 12.1322 11.0517 11.9743 11.1493C11.8163 11.247 11.6886 11.3867 11.6056 11.5528C11.5225 11.7189 11.4874 11.9048 11.504 12.0898C11.5207 12.2748 11.5886 12.4514 11.7 12.6L18.137 21.182L12.747 27.342C12.6605 27.4409 12.5944 27.5558 12.5523 27.6803C12.5103 27.8047 12.4931 27.9363 12.5019 28.0673C12.5107 28.1984 12.5452 28.3264 12.6035 28.4442C12.6617 28.5619 12.7426 28.667 12.8415 28.7535C12.9404 28.84 13.0553 28.9061 13.1798 28.9482C13.3042 28.9902 13.4358 29.0074 13.5668 28.9986C13.6979 28.9898 13.8259 28.9553 13.9437 28.897C14.0614 28.8388 14.1665 28.7579 14.253 28.659L19.363 22.818L23.7 28.6C23.7931 28.7242 23.9139 28.825 24.0528 28.8944C24.1916 28.9639 24.3448 29 24.5 29H28.5C28.6857 29 28.8678 28.9483 29.0257 28.8507C29.1837 28.753 29.3114 28.6133 29.3944 28.4472C29.4775 28.2811 29.5126 28.0952 29.496 27.9102C29.4793 27.7252 29.4114 27.5486 29.3 27.4L22.863 18.818L28.253 12.659Z"
                    fill="#BAB8B9"
                  />
                </svg>
                <p className="inter font-light text-base text-[#BAB8B9]">
                  @qacent
                </p>
              </div>
            </div>
            <div>
              <h2 className="mb-6 text-lg font-semibold text-[#FFFBFD]">
                About
              </h2>
              <ul className="text-[#BAB8B9] text-base inter font-normal">
                <li className="mb-4">
                  <a href="" className="">
                    About Us
                  </a>
                </li>
                <li className="mb-4">
                  <a href="" className="hover:underline">
                    Feature
                  </a>
                </li>
                <li className="mb-4">
                  <a href="" className="hover:underline">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-lg font-semibold text-[#FFFBFD]">
                Help
              </h2>
              <ul className="text-[#BAB8B9] text-base inter font-normal">
                <li className="mb-4">
                  <a href="" className="">
                    Customer Support{" "}
                  </a>
                </li>
                <li className="mb-4">
                  <a href="" className="">
                    Terms of use
                  </a>
                </li>
                <li className="mb-4">
                  <a href="" className="">
                    Privacy policy{" "}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-lg font-semibold text-[#FFFBFD]">
                Follow the latest developments
              </h2>
              <p className="inter font-normal text-base text-[#BAB8B9]">
                Get the latest news straight to your inbox.
              </p>

              <div className="relative mt-4">
                <div className="absolute inset-y-0 start-2 h-8 w-8 flex items-center  pointer-events-none bg-[#FFFFFF29] justify-center top-1/2 rounded-full -translate-y-1/2">
                  <svg
                    className="w-[13px] h-[13px] text-[#FFFFFFB8]"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  id="default-search"
                  className="block w-full p-4 ps-12 text-sm text-[#777576] placeholder:text-[#777576] focus:outline-none border border-[#3D3D3D] bg-[#2B2B2B] rounded-full"
                  placeholder="Write email here"
                  required
                />
                {/* <button
                    type="submit"
                    className="text-white absolute end-2.5 bottom-2.5 bg-blue-700  font-medium rounded-lg text-sm px-4 py-2"
                  >
                    Search
                  </button> */}
              </div>
            </div>
          </div>
          <hr className="my-6 border-[#FFFFFF40] sm:mx-auto lg:my-8" />
          <div className="sm:flex sm:items-center sm:justify-between">
            <span className="text-sm inter text-semibold text-[#FFFFFF80] sm:text-center">
              © Copyright 2024, all right reserve by
              <a href="https://flowbite.com/" className="gradient_text ml-1">
                Qacent
              </a>
            </span>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
