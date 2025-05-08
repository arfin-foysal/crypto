import React from "react";

const HeroSection = () => {
  return (
    <>
      <section className="">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center py-10">
            <img
              src="/assets/frontend_assets/title-ellipse.png"
              alt=""
              className="absolute left-0 top-0"
            />
            <h1 className="inter font-bold text-[84px] text-[#9AD35B] leading-none ">
              Secure & Intuitive Crypto Trading
            </h1>
            <p className="inter font-normal workSans text-[#FFFFFF] text-xl mt-10">
              Qacent Virtual Accounts empower people worldwide to receive ACH
              transfers and wire payments from US companies and individuals.
              Funds are instantly converted to USDC, offering seamless access to
              the onchain economy!
            </p>
          </div>
          <div
            className="backdrop-blur-3xl pb-10"
            style={{
              backgroundImage: "url('/assets/frontend_assets/hero-bg.png')",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <img
              src="/assets/frontend_assets/hero-img.svg"
              alt=""
              className="mx-auto"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
