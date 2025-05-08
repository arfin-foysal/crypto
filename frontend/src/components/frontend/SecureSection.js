import React from "react";
import ScrollAnimation from "./ScrollAnimation";
import Link from "next/link";

const SecureSection = () => {
  return (
    <>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <span className="inter font-light uppercase text-[11.25px] text-[#FDFDFC]/64 border border-[#FDFDFC]/12 rounded-full px-3 py-1 inline-block tracking-[0.72px]">
                Security
              </span>
              <h1 className="text-4xl font-normal max-w-md inter text-white my-4">
                Keep your money, the most secure base layer{" "}
              </h1>

              <div className="my-8 flex flex-col space-y-8">
                <div className="flex items-start space-x-4">
                  <img
                    src="/assets/frontend_assets/secure-icon-1.svg"
                    alt=""
                    className=""
                  />
                  <div className="max-w-sm">
                    <h6 className="inter font-medium text-base text-white uppercase tracking-[0.88px]">
                      SECURED BY E2EE
                    </h6>
                    <p className="inter font-light text-xl text-[#818688]">
                      Transactions on Qacent will be secured through End-to-End
                      Encryption
                    </p>
                  </div>
                </div>{" "}
                <div className="flex items-start space-x-4">
                  <img
                    src="/assets/frontend_assets/secure-icon-2.svg"
                    alt=""
                    className=""
                  />
                  <div className="max-w-sm">
                    <h6 className="inter font-medium text-base text-white capitalize tracking-[0.88px]">
                      KYC/AML Compliance{" "}
                    </h6>
                    <p className="inter font-light text-xl text-[#818688]">
                      Know Your Customer (KYC) verification via ID documents
                    </p>
                  </div>
                </div>{" "}
                <div className="flex items-start space-x-4">
                  <img
                    src="/assets/frontend_assets/secure-icon-3.svg"
                    alt=""
                    className=""
                  />
                  <div className="max-w-sm">
                    <h6 className="inter font-medium text-base text-white capitalize tracking-[0.88px]">
                      Role-Based Access Control (RBAC){" "}
                    </h6>
                    <p className="inter font-light text-xl text-[#818688]">
                      For admin dashboards, employee roles, and internal
                      systems.
                    </p>
                  </div>
                </div>{" "}
                <div className="flex items-start space-x-4">
                  <img
                    src="/assets/frontend_assets/secure-icon-4.svg"
                    alt=""
                    className=""
                  />
                  <div className="max-w-sm">
                    <h6 className="inter font-medium text-base text-white capitalize tracking-[0.88px]">
                      Secure APIs{" "}
                    </h6>
                    <p className="inter font-light text-xl text-[#818688]">
                      Token-based authentication (OAuth2, API keys). Rate
                      limiting to prevent abuse
                    </p>
                  </div>
                </div>
                <Link
                  href=""
                  className="text-black inter font-medium text-[13px] tracking-[0.39px] px-4 py-3 bg-[#95DA66] uppercase w-[170px] rounded-full text-center"
                >
                  Start Exchange
                </Link>
              </div>
            </div>
            <div className="flex-1">
              <ScrollAnimation />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SecureSection;
