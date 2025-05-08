import React from "react";
import Image from "next/image";

const AboutUsSection = () => {
  return (
    <>
      <section className="pt-10 pb-20 relative">
        <img
          src="/assets/frontend_assets/about-Ellipse.png"
          alt=""
          className="absolute bottom-0 left-0 w-[400px] h-[400px] z-10"
        />
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mx-auto px-4">
            <div className="text-center mb-12 max-w-4xl mx-auto">
              <h1 className="text-[52px] font-medium inter text-white mb-4">
                About us{" "}
              </h1>
              <p className="inter font-normal inter text-[#FFFFFF] text-xl mt-2">
                Discover who we are, what we stand for, and how our mission
                drives us to deliver excellence every step of the way.
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-[#CDEAF71A] to-[#648A3A0D] rounded-[32px] p-16 border border-[#FFFFFF0D]">
            <div className="flex flex-col lg:flex-row items-start gap-16">
              <div className="lg:w-1/2">
                <div className="">
                  <div className="mb-4">
                    <p className="text-sm text-gray-300 inline-flex items-center relative">
                      <span className=""> Our Story</span>
                      <svg
                        width={46}
                        height={13}
                        className="absolute -right-13 top-2.5"
                        viewBox="0 0 46 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <line y1="0.5" x2="42.0119" y2="0.5" stroke="white" />
                        <path
                          d="M41.6464 12.3536C41.8417 12.5488 42.1583 12.5488 42.3536 12.3536L45.5355 9.17157C45.7308 8.97631 45.7308 8.65973 45.5355 8.46447C45.3403 8.2692 45.0237 8.2692 44.8284 8.46447L42 11.2929L39.1716 8.46447C38.9763 8.2692 38.6597 8.2692 38.4645 8.46447C38.2692 8.65973 38.2692 8.97631 38.4645 9.17157L41.6464 12.3536ZM41.5 0V12H42.5V0L41.5 0Z"
                          fill="white"
                        />
                      </svg>
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <svg
                      width={20}
                      height={128}
                      viewBox="0 0 20 128"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        width={20}
                        height={128}
                        fill="url(#paint0_linear_714_1052)"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_714_1052"
                          x1={10}
                          y1={-40}
                          x2={10}
                          y2={115}
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#648A3A" />
                          <stop offset={1} stopColor="#262922" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <div className="ml-4">
                      <h1 className="text-3xl inter font-semibold text-white mb-4 leading-tight">
                        Get To Know The People
                        <br />
                        Driving Our Vision Forward
                      </h1>
                      <h2 className="text-3xl font-semibold text-[#9AD35B] mb-6">
                        Proven Reliability
                      </h2>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <Image
                    src="/assets/frontend_assets/about-1.png"
                    alt="Team collaboration"
                    width={600}
                    height={320}
                    className="rounded-lg w-full h-auto object-cover shadow-lg"
                    style={{ maxHeight: "320px" }}
                  />
                </div>
              </div>

              <div className="lg:w-1/2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Image
                    src="/assets/frontend_assets/about-2.png"
                    alt="Professional working"
                    width={300}
                    height={180}
                    className="rounded-lg w-full h-auto object-cover shadow-lg"
                    style={{ height: "180px" }}
                  />
                  <Image
                    src="/assets/frontend_assets/about-3.png"
                    alt="Team collaboration"
                    width={300}
                    height={180}
                    className="rounded-lg w-full h-auto object-cover shadow-lg"
                    style={{ height: "180px" }}
                  />
                </div>
                <div className="py-6 rounded-lg mb-2">
                  <p className="text-sm font-normal inter tracking-[2%] text-[#E3E3E3E0] leading-tight">
                    Qacentthe Next Generation Of Onchain Financial Management.
                    Our Platform Combines A Streamlined, User-Centric Interface
                    With A Powerful Backend Built On Decentralized Ledger
                    Technology. This Allows Us To Provide A Highly Secure,
                    Transparent, And Interoperable Environment Where Users Can
                    Effortlessly Control Their Entire Financial Life, From
                    Simple Transactions To Complex DeFi Interactions.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row justify-between gap-8">
                  <div className="flex flex-col items-center sm:items-start">
                    <h3 className="text-3xl inter font-semibold text-white mb-2">
                      10K+
                    </h3>
                    <p className="text-white inter text-sm font-semibold">
                      Active Users
                    </p>
                  </div>

                  <div className="flex flex-col items-center sm:items-start">
                    <h3 className="text-3xl inter font-semibold text-white mb-2">
                      10+
                    </h3>
                    <p className="text-white inter text-sm font-semibold">
                      Popular Networks
                    </p>
                  </div>

                  <div className="flex flex-col items-center sm:items-start">
                    <h3 className="text-3xl inter font-semibold text-white mb-2">
                      50+
                    </h3>
                    <p className="text-white inter text-sm font-semibold">
                      Worldwide Honours
                    </p>
                  </div>
                </div>
                <div className="mt-8">
                  <h3 className="text-sm font-semibold text-white inter mb-4">
                    Support Team
                  </h3>

                  <div className="flex flex-col sm:flex-row items-center gap-8">
                    <div className="flex -space-x-4">
                      <Image
                        className="w-15 h-15 rounded-full border-2 border-[#648A3A80] object-cover"
                        src="https://images.pexels.com/photos/3728512/pexels-photo-3728512.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        alt="Support team member"
                        width={60}
                        height={60}
                      />
                      <Image
                        className="w-15 h-15 rounded-full border-2 border-[#648A3A80] object-cover"
                        src="https://images.pexels.com/photos/3781543/pexels-photo-3781543.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        alt="Support team member"
                        width={60}
                        height={60}
                      />
                      <Image
                        className="w-15 h-15 rounded-full border-2 border-[#648A3A80] object-cover"
                        src="https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        alt="Support team member"
                        width={60}
                        height={60}
                      />
                    </div>

                    <div className="flex items-center gap-4 mt-4 sm:mt-0">
                      <div className="w-14 h-14 border-[#648A3A] border-2 rounded-full flex items-center justify-center transition-colors cursor-pointer group">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-6 h-6 text-white group-hover:scale-110 transition-transform"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <p className="text-white text-base inter font-medium">
                        Watch: How Qacent Works.
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

export default AboutUsSection;
