import React from "react";

const PoweredBySection = () => {
  return (
    <>
      <section className="pt-10 pb-20">
        <div className="">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12 max-w-4xl mx-auto">
              <h1 className="text-[52px] font-medium inter text-white mb-4">
                Powered By{" "}
              </h1>
              <p className="inter font-normal inter text-[#FFFFFF] text-xl mt-2">
                Fueled by the support of industry leaders and strategic partners
                who help turn our vision into reality.
              </p>
            </div>
          </div>
          <div className="bg-[#FFFFFF0D] py-10">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-6 gap-4">
                <img
                  src="/assets/frontend_assets/p-1.svg"
                  alt=""
                  className=""
                />{" "}
                <img
                  src="/assets/frontend_assets/p-2.svg"
                  alt=""
                  className=""
                />{" "}
                <img
                  src="/assets/frontend_assets/p-3.svg"
                  alt=""
                  className=""
                />{" "}
                <img
                  src="/assets/frontend_assets/p-4.svg"
                  alt=""
                  className=""
                />{" "}
                <img
                  src="/assets/frontend_assets/p-5.svg"
                  alt=""
                  className=""
                />{" "}
                <img
                  src="/assets/frontend_assets/p-6.svg"
                  alt=""
                  className=""
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PoweredBySection;
