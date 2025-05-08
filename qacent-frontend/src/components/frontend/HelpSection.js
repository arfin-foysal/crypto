import Link from "next/link";
import React from "react";

const HelpSection = () => {
  return (
    <>
      <section className="bg-[#1C1C1C] py-20 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-20 max-w-4xl mx-auto">
              <h1 className="text-[52px] font-medium inter text-white mb-4">
                Help & Query{" "}
              </h1>
              <p className="inter font-normal inter text-[#FFFFFF] text-xl mt-2">
                Our Help & Query centre is here to provide you with detailed
                guides, real-time support, and expert resources to ensure a
                smooth & secure experience
              </p>
            </div>
          </div>
          <div className="max-w-xl mx-auto">
            <div className="grid grid-cols-3 gap-4">
              <Link href="" className="">
                <img
                  src="/assets/frontend_assets/help.svg"
                  alt=""
                  className=""
                />
              </Link>

              <Link href="" className="">
                <img
                  src="/assets/frontend_assets/security.svg"
                  alt=""
                  className=""
                />
              </Link>
              <Link href="" className="">
                {" "}
                <img
                  src="/assets/frontend_assets/contact.svg"
                  alt=""
                  className=""
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HelpSection;
