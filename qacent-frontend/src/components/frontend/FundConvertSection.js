import Link from "next/link";
import React from "react";

const FundConvertSection = () => {
  return (
    <>
      <section className="relative overflow-hidden py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center space-x-8">
            <div className="flex-1">
              <h2 className="inter font-medium text-[62px] leading-none text-[#FFFFFF]">
                Funds convert to USDC automatically and can be withdrawn
                anytime.
              </h2>
              <p className="inter font-light text-[#FFFFFF] text-[23px] leading-normal tracking-[-0.5px] mt-10">
                Redeemable 1:1 for US dollars, USDC enables 24/7 liquidity for
                near-instant, low-cost global payments.
              </p>
              <Link
                href=""
                className="inter font-semibold inline-block text-[#FFFFFF] text-base tracking-[0.5px] bg-[#648A3A] w-[250px] text-center px-4 py-3 rounded-lg mt-10"
              >
                Withdraw Now
              </Link>
            </div>
            <div className="flex-1">
              <img
                src="/assets/frontend_assets/fund-section-img.png"
                alt=""
                className=""
              />
            </div>
          </div>
        </div>
        <img
          src="/assets/frontend_assets/convert-ellipse.png"
          alt=""
          className="absolute right-0 top-0 -z-1"
        />
      </section>
    </>
  );
};

export default FundConvertSection;
