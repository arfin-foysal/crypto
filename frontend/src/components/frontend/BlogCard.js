import Link from "next/link";
import React from "react";

const BlogCard = () => {
  return (
    <>
      <div className="relative after:content-[''] after:absolute after:top-0 after:-right-8  after:bg-[#262626] after:w-[1px] last:after:hidden after:h-full">
        <img
          src="/assets/frontend_assets/blog-card-1.png"
          alt=""
          className=""
        />
        <div className="py-4">
          <h4 className="inter font-semibold text-[22px] tracking-[-3%] text-white">
            AI in Crypto
          </h4>
          <p className="text-[#98989A] text-lg inter font-normal tracking-[-3%] mt-2">
            Dr. Lisa Adams discusses how AI is revolutionizing healthcare, from
            diagnostic tools to patient care.
          </p>
          <Link
            href=""
            className="border-[#262626] border bg-[#14141480] px-10 py-3 rounded-md inline-flex items-center text-[#98989A] text-lg inter font-normal tracking-[-3%] mt-5"
          >
            Read Now
            <svg
              width={24}
              height={25}
              className="ml-2"
              viewBox="0 0 24 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.25 4.25L19.5 4.25C19.6989 4.25 19.8897 4.32902 20.0303 4.46967C20.171 4.61032 20.25 4.80109 20.25 5V16.25C20.25 16.6642 19.9142 17 19.5 17C19.0858 17 18.75 16.6642 18.75 16.25V6.81066L5.03033 20.5303C4.73744 20.8232 4.26256 20.8232 3.96967 20.5303C3.67678 20.2374 3.67678 19.7626 3.96967 19.4697L17.6893 5.75L8.25 5.75C7.83579 5.75 7.5 5.41421 7.5 5C7.5 4.58579 7.83579 4.25 8.25 4.25Z"
                fill="#95DA66"
              />
            </svg>
          </Link>
        </div>
      </div>
    </>
  );
};

export default BlogCard;
