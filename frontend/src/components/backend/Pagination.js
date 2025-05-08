import React from "react";

const Pagination = () => {
  return (
    <>
      <nav aria-label="">
        <ul className="flex items-center justify-center space-x-1 h-10 text-base">
          <li>
            <a
              href="#"
              className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-[#95DA66] cursor-pointer border border-[#BCBCBC] rounded-md"
            >
              <svg
                className="w-3 h-3 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 1 1 5l4 4"
                />
              </svg>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center cursor-pointer justify-center px-4 h-10 leading-tight  bg-[#959595] border border-[#959595] text-white rounded-md"
            >
              1
            </a>
          </li>

          <li>
            <a
              href="#"
              className="flex items-center cursor-pointer justify-center px-4 h-10 leading-tight border border-[#959595] text-[#BCBCBC] rounded-md"
            >
              3
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center cursor-pointer justify-center px-4 h-10 leading-tight  border border-[#959595] text-[#BCBCBC] rounded-md"
            >
              4
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center cursor-pointer justify-center px-4 h-10 leading-tight  border border-[#959595] text-[#BCBCBC] rounded-md"
            >
              5
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center cursor-pointer justify-center px-4 h-10 ms-0 leading-tight text-[#95DA66] border border-[#BCBCBC] rounded-md"
            >
              <span className="sr-only">Next</span>
              <svg
                className="w-3 h-3 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m1 9 4-4-4-4"
                />
              </svg>
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Pagination;
