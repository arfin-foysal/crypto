import React from "react";

const VirtualSection = () => {
  return (
    <>
      <section className="h-screen">
        <div className="max-w-6xl mx-auto py-8">
          <div className="relative">
            <img
              src="/assets/frontend_assets/secure.png"
              alt=""
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"
            />
            <div className="timeline">
              <div className="timeline__container left ">
                <div className="content border-[#FFFFFF0D] border bg-gradient-to-r from-[#648A3A0D] to-[#CDEAF71A] backdrop-blur-[3.9px]">
                  <div className="flex items-center space-x-4 h-full">
                    <img
                      src="/assets/frontend_assets/v1-icon.svg"
                      alt=""
                      className=""
                    />
                    <div className="max-w-xs">
                      <h2 className="inter font-medium text-[26px] text-white capitalize">
                        Instant virtual account
                      </h2>
                      <p className="inter font-light text-base text-[#FFFFFFBF]">
                        Get instant access to your own virtual US bank account
                        with just a few clicks.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="timeline__container right">
                <div className="content border-[#FFFFFF0D] border bg-gradient-to-r from-[#648A3A0D] to-[#CDEAF71A] backdrop-blur-[3.9px]">
                  <div className="flex items-center space-x-4 h-full">
                    <img
                      src="/assets/frontend_assets/v1-icon.svg"
                      alt=""
                      className=""
                    />
                    <div className="">
                      <h2 className="inter font-medium text-[26px] text-white capitalize">
                        receive money{" "}
                      </h2>
                      <p className="inter font-light text-base text-[#FFFFFFBF]">
                        Receive USD via ACH, Wire, or FedNow Seamlessly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="timeline__container left">
                <div className="content border-[#FFFFFF0D] border bg-gradient-to-r from-[#648A3A0D] to-[#CDEAF71A] backdrop-blur-[3.9px]">
                  <div className="flex items-center space-x-4 h-full">
                    <img
                      src="/assets/frontend_assets/v2-icon.svg"
                      alt=""
                      className=""
                    />
                    <div className="">
                      <h2 className="inter font-medium text-[26px] text-white capitalize">
                        Auto USDC conversion{" "}
                      </h2>
                      <p className="inter font-light text-base text-[#FFFFFFBF]">
                        Automatic and hassle-free conversion to USDC
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="timeline__container right">
                <div className="content border-[#FFFFFF0D] border bg-gradient-to-r from-[#648A3A0D] to-[#CDEAF71A] backdrop-blur-[3.9px]">
                  <div className="flex items-center space-x-4 h-full">
                    <img
                      src="/assets/frontend_assets/v4-icon.svg"
                      alt=""
                      className=""
                    />
                    <div className="">
                      <h2 className="inter font-medium text-[26px] text-white capitalize">
                        Transfer to crypto wallet{" "}
                      </h2>
                      <p className="inter font-light text-base text-[#FFFFFFBF]">
                        Withdraw funds straight to your crypto wallet with ease.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default VirtualSection;
