import React from "react";

const VirtualAcountSection = () => {
  return (
    <>
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 gap-8">
            <div className="border-r-2 border-b-2 border-[#648A3A] rounded-br-[20px] overflow-hidden">
              <div className="py-8 pl-12 pr-20">
                <div className="flex items-end space-x-2 mb-4">
                  <span className="inline-block w-16 h-[2px] bg-[#FFFFFF]" />
                  <span className="poppins font-semibold text-base text-[#FFFFFF]">
                    Virtual Account
                  </span>
                </div>
                <h3 className="poppins font-semibold text-[40px] text-[#FFFFFF] mb-5">
                  Get a Virtual US Bank Account Instantly
                </h3>
                <p className="inter font-light text-base text-[#FFFFFF]">
                  Open your virtual US bank account in seconds—no paperwork, no
                  waiting. Receive USD and manage your funds with ease, anytime,
                  anywhere.
                </p>
              </div>
              <div className="bg-gradient-to-tr from-[#9EDA581A] to-[#68DB9F1A] backdrop-blur-[3.9px] px-8 py-4 rounded-tl-[20px] rounded-br-[20px]">
                <div className="flex items-end space-x-4">
                  <div className="flex-1">
                    <div className="mb-4">
                      <p className="inter font-semibold text-[13px] text-[#FFFBFD]">
                        Bank details
                      </p>
                      <p className="text-[8px] text-[#777576] inter font-semibold">
                        Details information of your bank account
                      </p>
                    </div>
                    <div className="mb-4">
                      <p className="text-[10px] text-[#777576] work_sans font-semibold">
                        Account Holder Name
                      </p>
                      <p className="work_sans font-semibold text-[13px] text-[#FFFBFD] uppercase">
                        Wade Warren{" "}
                      </p>
                    </div>
                    <div className="mb-4">
                      <p className="text-[10px] text-[#777576] work_sans font-semibold">
                        Routing No.{" "}
                      </p>
                      <p className="work_sans font-semibold text-[13px] text-[#FFFBFD] uppercase">
                        271974046{" "}
                      </p>
                    </div>
                    <div className="">
                      <p className="text-[10px] text-[#777576] work_sans font-semibold">
                        Account Type{" "}
                      </p>
                      <p className="work_sans font-semibold text-[13px] text-[#FFFBFD] uppercase">
                        Active{" "}
                      </p>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="mb-4">
                      <p className="text-[10px] text-[#777576] work_sans font-semibold">
                        Bank Name{" "}
                      </p>
                      <p className="work_sans font-semibold text-[13px] text-[#FFFBFD] uppercase">
                        LEAD BANK{" "}
                      </p>
                    </div>
                    <div className="mb-4">
                      <p className="text-[10px] text-[#777576] work_sans font-semibold">
                        Account No.
                      </p>
                      <p className="work_sans font-semibold text-[13px] text-[#FFFBFD] uppercase">
                        531****523{" "}
                      </p>
                    </div>
                    <div className="">
                      <p className="text-[10px] text-[#777576] work_sans font-semibold">
                        Bank Address{" "}
                      </p>
                      <p className="work_sans font-semibold text-[13px] text-[#FFFBFD] uppercase">
                        1801 Main St., Kansas City, MO 64108{" "}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="/assets/frontend_assets/vr-ellipse-2.png"
                alt=""
                className="absolute right-[-40%] top-[-40%]"
              />
              <img
                src="/assets/frontend_assets/visa-card.svg"
                alt=""
                className="mx-auto mt-10 z-10"
              />
            </div>
          </div>
        </div>
        <img
          src="/assets/frontend_assets/vr-account-ellipse.png"
          alt=""
          className="absolute right-0 top-0 -z-1"
        />
      </section>
    </>
  );
};

export default VirtualAcountSection;
