import React from "react";

const SeamlessSection = () => {
  return (
    <>
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center space-x-8">
            <div className="flex-1">
              <h2 className="inter font-semibold text-[40px] leading-none text-[#FFFFFF]">
                Access USDC seamlessly from anywhere
              </h2>
              <p className="inter font-light text-[#BAB8B9] text-[22px] leading-normal tracking-[-0.5px] mt-10">
                Qacent Virtual Accounts provide individuals and businesses
                worldwide with the ability to receive ACH and wire payments from
                U.S.-based sources. Once received, funds are instantly converted
                into USDC, enabling seamless digital access and management with
                speed, efficiency, and financial freedom.
              </p>
            </div>
            <div className="flex-1 relative">
              <img
                src="/assets/frontend_assets/access-bg.png"
                alt=""
                className="absolute top-0 left-0 w-full h-full -z-1"
              />
              <div
                className="w-[80%] mx-auto relative"
                style={{
                  backgroundImage: "url('/assets/frontend_assets/div-bg.png')",
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <div className="w-full h-full p-8">
                  <p className="inter font-semibold text-xl tracking-[-0.07px] text-white text-center">
                    Withdraw your amount
                  </p>
                  <div className="mt-4">
                    <p className="inter semibold text-sm text-white">
                      Enter amount
                    </p>
                    <div className="border border-[#FFFFFF]/50 mt-2 flex items-center justify-between px-4 py-3 rounded-lg">
                      <p className="inter text-lg font-semibold text-white tracking-[-0.33px]">
                        1000
                      </p>
                      <p className="flex items-center inter text-base font-semibold text-white tracking-[-0.33px]">
                        <svg
                          width={19}
                          height={19}
                          className="mr-2"
                          viewBox="0 0 19 19"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <mask
                            id="mask0_1059_1330"
                            style={{ maskType: "luminance" }}
                            maskUnits="userSpaceOnUse"
                            x={2}
                            y={1}
                            width={16}
                            height={17}
                          >
                            <path
                              d="M17.6629 1.82422H2.23438V17.2528H17.6629V1.82422Z"
                              fill="white"
                            />
                          </mask>
                          <g mask="url(#mask0_1059_1330)">
                            <path
                              d="M8.28281 2.00661L8.42186 2.14566L7.93972 2.62781L7.52635 2.21447C6.77696 2.46221 6.07886 2.82143 5.45092 3.27296L5.60935 3.43137L5.12721 3.91351L4.91188 3.69819C4.67411 3.90344 4.4476 4.12136 4.2365 4.35381L4.59974 4.71708L4.1176 5.19922L3.79968 4.88125C3.61976 5.11836 3.45393 5.3665 3.30196 5.62396L3.6808 6.00278L3.19866 6.48492L2.96791 6.25417C2.49816 7.25081 2.23438 8.36367 2.23438 9.5385H9.94866V1.82422C9.37648 1.82422 8.81951 1.88842 8.28281 2.00661Z"
                              fill="#1D1D8C"
                            />
                            <path
                              d="M14.2128 3.10993C12.9913 2.29817 11.5258 1.82422 9.94922 1.82422V3.10993H14.2128Z"
                              fill="white"
                            />
                            <path
                              d="M9.94922 4.39899H15.6976C15.26 3.91017 14.7611 3.47768 14.2128 3.11328H9.94922V4.39899Z"
                              fill="#F23E53"
                            />
                            <path
                              d="M9.94924 5.68414H16.6289C16.3623 5.22348 16.0504 4.79249 15.6976 4.39844H9.94922L9.94924 5.68414Z"
                              fill="white"
                            />
                            <path
                              d="M9.94922 6.96149H17.2228C17.0639 6.51218 16.8643 6.08249 16.6289 5.67578H9.94922V6.96149Z"
                              fill="#F23E53"
                            />
                            <path
                              d="M9.94922 8.25055H17.5548C17.4806 7.80806 17.369 7.37835 17.2228 6.96484H9.94924L9.94922 8.25055Z"
                              fill="white"
                            />
                            <path
                              d="M9.94922 9.54352H17.6635C17.6635 9.10523 17.6251 8.67614 17.5548 8.25781H9.94922V9.54352Z"
                              fill="#F23E53"
                            />
                            <path
                              d="M9.94866 9.53906H2.23438C2.23438 9.97735 2.27283 10.4064 2.34305 10.8248H17.5542C17.6245 10.4064 17.6629 9.97733 17.6629 9.53906H9.94866Z"
                              fill="white"
                            />
                            <path
                              d="M2.67578 12.1099H17.2229C17.3692 11.6964 17.4807 11.2667 17.5549 10.8242H2.34375C2.41802 11.2667 2.52959 11.6964 2.67578 12.1099Z"
                              fill="#F23E53"
                            />
                            <path
                              d="M3.27359 13.399H16.633C16.8684 12.9923 17.068 12.5626 17.2269 12.1133H2.67969C2.83855 12.5626 3.03821 12.9923 3.27359 13.399Z"
                              fill="white"
                            />
                            <path
                              d="M4.2047 14.6802H15.7015C16.0543 14.2862 16.3662 13.8552 16.6328 13.3945H3.27344C3.54004 13.8552 3.85189 14.2862 4.2047 14.6802Z"
                              fill="#F23E53"
                            />
                            <path
                              d="M5.68797 15.9654H14.2151C14.7635 15.601 15.2623 15.1685 15.7 14.6797H4.20312C4.64074 15.1685 5.13962 15.601 5.68797 15.9654Z"
                              fill="white"
                            />
                            <path
                              d="M9.95109 17.2545C11.5277 17.2545 12.9931 16.7805 14.2147 15.9688H5.6875C6.90903 16.7805 8.37448 17.2545 9.95109 17.2545Z"
                              fill="#F23E53"
                            />
                            <path
                              d="M4.11496 6.80859L3.63281 7.29074L4.11496 7.77288L4.5971 7.29074L4.11496 6.80859Z"
                              fill="white"
                            />
                            <path
                              d="M6.01339 6.80859L5.53125 7.29074L6.01339 7.77288L6.49554 7.29074L6.01339 6.80859Z"
                              fill="white"
                            />
                            <path
                              d="M7.93917 6.80859L7.45703 7.29074L7.93917 7.77288L8.42132 7.29074L7.93917 6.80859Z"
                              fill="white"
                            />
                            <path
                              d="M6.01339 4.23438L5.53125 4.71652L6.01339 5.19866L6.49554 4.71652L6.01339 4.23438Z"
                              fill="white"
                            />
                            <path
                              d="M7.93917 4.23438L7.45703 4.71652L7.93917 5.19866L8.42132 4.71652L7.93917 4.23438Z"
                              fill="white"
                            />
                            <path
                              d="M3.20089 8.09375L2.71875 8.57589L3.20089 9.05804L3.68304 8.57589L3.20089 8.09375Z"
                              fill="white"
                            />
                            <path
                              d="M5.13058 8.09375L4.64844 8.57589L5.13058 9.05804L5.61272 8.57589L5.13058 8.09375Z"
                              fill="white"
                            />
                            <path
                              d="M7.02121 8.09375L6.53906 8.57589L7.02121 9.05804L7.50335 8.57589L7.02121 8.09375Z"
                              fill="white"
                            />
                            <path
                              d="M8.95089 8.09375L8.46875 8.57589L8.95089 9.05804L9.43304 8.57589L8.95089 8.09375Z"
                              fill="white"
                            />
                            <path
                              d="M5.13058 5.51953L4.64844 6.00167L5.13058 6.48382L5.61272 6.00167L5.13058 5.51953Z"
                              fill="white"
                            />
                            <path
                              d="M7.02121 5.51953L6.53906 6.00167L7.02121 6.48382L7.50335 6.00167L7.02121 5.51953Z"
                              fill="white"
                            />
                            <path
                              d="M8.95089 5.51953L8.46875 6.00167L8.95089 6.48382L9.43304 6.00167L8.95089 5.51953Z"
                              fill="white"
                            />
                            <path
                              d="M7.02121 2.94922L6.53906 3.43136L7.02121 3.9135L7.50335 3.43136L7.02121 2.94922Z"
                              fill="white"
                            />
                            <path
                              d="M8.95089 2.94922L8.46875 3.43136L8.95089 3.9135L9.43304 3.43136L8.95089 2.94922Z"
                              fill="white"
                            />
                            <path
                              d="M4.59694 4.71483L4.2337 4.35156C4.08023 4.52051 3.93498 4.6969 3.79688 4.879L4.1148 5.19698L4.59694 4.71483Z"
                              fill="white"
                            />
                            <path
                              d="M3.68165 5.99991L3.3028 5.62109C3.18222 5.82543 3.07048 6.03545 2.96875 6.2513L3.1995 6.48206L3.68165 5.99991Z"
                              fill="white"
                            />
                            <path
                              d="M5.61153 3.43185L5.4531 3.27344C5.26699 3.40728 5.08725 3.54917 4.91406 3.69869L5.12939 3.91401L5.61153 3.43185Z"
                              fill="white"
                            />
                            <path
                              d="M8.42676 2.14686L8.28771 2.00781C8.03046 2.06446 7.77818 2.13401 7.53125 2.21564L7.94462 2.62898L8.42676 2.14686Z"
                              fill="white"
                            />
                          </g>
                        </svg>
                        USD
                      </p>
                    </div>
                  </div>{" "}
                  <div className="mt-4">
                    <p className="inter semibold text-sm text-white">
                      Receive amount{" "}
                    </p>
                    <div className="border border-[#FFFFFF]/50 mt-2 flex items-center justify-between px-4 py-3 rounded-lg">
                      <p className="flex items-center inter text-lg font-medium text-white tracking-[-0.33px]">
                        <svg
                          width={24}
                          height={25}
                          className="mr-2"
                          viewBox="0 0 24 25"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12.0014 22.495C14.6529 22.495 17.1958 21.4417 19.0707 19.5668C20.9456 17.6919 21.9989 15.149 21.9989 12.4975C21.9989 9.846 20.9456 7.3031 19.0707 5.4282C17.1958 3.55331 14.6529 2.5 12.0014 2.5C9.34991 2.5 6.807 3.55331 4.93211 5.4282C3.05721 7.3031 2.00391 9.846 2.00391 12.4975C2.00391 15.149 3.05721 17.6919 4.93211 19.5668C6.807 21.4417 9.34991 22.495 12.0014 22.495Z"
                            fill="url(#paint0_linear_1059_1373)"
                          />
                          <path
                            d="M10.17 19.4104C10.17 19.6654 9.9975 19.7479 9.75 19.7479C6.6675 18.7429 4.5 15.9154 4.5 12.5779C4.5 9.24794 6.6675 6.41294 9.75 5.41544C9.9975 5.32544 10.17 5.49044 10.17 5.74544V6.33044C10.17 6.49544 10.08 6.66044 9.915 6.74294C8.71986 7.18163 7.68796 7.9762 6.95843 9.01955C6.22889 10.0629 5.83679 11.3048 5.835 12.5779C5.84104 13.85 6.23481 15.0901 6.96378 16.1326C7.69275 17.1751 8.72226 17.9706 9.915 18.4129C10.08 18.4954 10.17 18.6604 10.17 18.8254V19.4104Z"
                            fill="white"
                          />
                          <path
                            d="M12.6709 17.3284C12.6709 17.5009 12.5059 17.6659 12.3334 17.6659H11.6734C11.5857 17.6606 11.5029 17.6233 11.4407 17.5612C11.3785 17.499 11.3413 17.4162 11.3359 17.3284V16.3309C10.0009 16.1659 9.33344 15.4159 9.08594 14.3284C9.08594 14.1634 9.16844 13.9984 9.33344 13.9984H10.0834C10.2559 13.9984 10.3384 14.0809 10.4209 14.2459C10.5859 14.8309 10.9234 15.3334 12.0034 15.3334C12.8359 15.3334 13.4209 14.9134 13.4209 14.2459C13.4209 13.5784 13.0834 13.3309 11.9209 13.1659C10.1734 12.9184 9.33344 12.4159 9.33344 10.9984C9.33344 9.91844 10.1734 9.07844 11.3359 8.91344V7.92344C11.3359 7.75844 11.5009 7.58594 11.6734 7.58594H12.3334C12.5059 7.58594 12.6709 7.75844 12.6709 7.92344V8.92094C13.6684 9.08594 14.3359 9.67094 14.5009 10.5859C14.5009 10.7584 14.4259 10.9234 14.2534 10.9234H13.5859C13.4209 10.9234 13.3384 10.8409 13.2559 10.6759C13.0834 10.0909 12.6709 9.83594 11.9209 9.83594C11.0884 9.83594 10.6684 10.2559 10.6684 10.8409C10.6684 11.4259 10.9234 11.7559 12.1684 11.9209C13.9234 12.1759 14.7559 12.6709 14.7559 14.0959C14.7559 15.1759 13.9234 16.0909 12.6709 16.3459V17.3359"
                            fill="white"
                          />
                          <path
                            d="M14.252 19.7505C14.0045 19.8255 13.832 19.668 13.832 19.413V18.828C13.832 18.663 13.922 18.498 14.087 18.4155C15.2822 17.9768 16.3141 17.1822 17.0436 16.1389C17.7731 15.0955 18.1652 13.8536 18.167 12.5805C18.161 11.3084 17.7672 10.0683 17.0383 9.02582C16.3093 7.98328 15.2798 7.1878 14.087 6.74547C14.0101 6.70752 13.9455 6.64872 13.9004 6.57579C13.8553 6.50285 13.8316 6.41871 13.832 6.33297V5.74797C13.832 5.50047 14.0045 5.41797 14.252 5.41797C17.252 6.41547 19.502 9.24297 19.502 12.5805C19.502 15.918 17.3345 18.7455 14.252 19.7505Z"
                            fill="white"
                          />
                          <defs>
                            <linearGradient
                              id="paint0_linear_1059_1373"
                              x1="7.45641"
                              y1="2.245"
                              x2="17.8364"
                              y2="22.1425"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#0666CE" />
                              <stop offset={1} stopColor="#61A9F8" />
                            </linearGradient>
                          </defs>
                        </svg>
                        USD
                      </p>
                      <p className="inter text-lg font-semibold text-white tracking-[-0.33px]">
                        1000
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="my-20">
            <div className="grid grid-cols-2 gap-4">
              <div
                className="p-8"
                style={{
                  backgroundImage: "url(/assets/frontend_assets/imi-bg.png)",
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <svg
                  width={52}
                  height={52}
                  viewBox="0 0 52 52"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M32.0196 3.35156L9.75 30.875H22.75L19.5498 48.4687C19.5437 48.5032 19.5452 48.5386 19.5543 48.5725C19.5634 48.6063 19.5798 48.6378 19.6024 48.6646C19.6249 48.6914 19.6531 48.713 19.6849 48.7277C19.7167 48.7425 19.7514 48.7501 19.7864 48.75C19.8237 48.75 19.8605 48.7412 19.8938 48.7245C19.9271 48.7077 19.9561 48.6834 19.9784 48.6535L42.25 21.125H29.25L32.4655 3.5293C32.4698 3.49424 32.4666 3.45867 32.4561 3.42494C32.4456 3.39121 32.4281 3.3601 32.4046 3.33368C32.3812 3.30726 32.3524 3.28614 32.3202 3.27171C32.2879 3.25728 32.253 3.24988 32.2177 3.25C32.179 3.25015 32.1409 3.25943 32.1065 3.27708C32.0721 3.29473 32.0423 3.32025 32.0196 3.35156Z"
                    stroke="white"
                    strokeWidth="3.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <h3 className="text-3xl inter font-semibold text-[#9AD35B] mt-3">
                  Immediate Accessibility
                </h3>
                <p className="inter text-base font-normal text-[#BAB8B9] mt-5">
                  Funds from your bank account can be seamlessly and instantly
                  converted into USDC through an automated process, giving you
                  fast and easy access to digital dollars
                </p>
              </div>
              <div
                className="p-8"
                style={{
                  backgroundImage: "url(/assets/frontend_assets/imi-bg.png)",
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <svg
                  width={52}
                  height={52}
                  viewBox="0 0 52 52"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M27.9296 24.0494C24.073 22.771 22.2096 21.9693 22.2096 19.9327C22.2096 17.7227 24.6146 16.921 26.1313 16.921C28.9696 16.921 30.0096 19.066 30.248 19.8243L33.6713 18.3727C33.3463 17.3977 31.8946 14.2127 28.168 13.5193V10.8327H23.8346V13.5627C18.4613 14.776 18.4396 19.7593 18.4396 19.976C18.4396 24.8944 23.3146 26.281 25.698 27.1477C29.1213 28.361 30.638 29.466 30.638 31.546C30.638 33.9944 28.363 35.0344 26.348 35.0344C22.4046 35.0344 21.278 30.9827 21.148 30.506L17.5513 31.9577C18.9163 36.7027 22.4913 37.981 23.8346 38.371V41.166H28.168V38.4794C29.0346 38.2844 34.4513 37.201 34.4513 31.5027C34.4513 28.491 33.1296 25.8477 27.9296 24.0494ZM6.5013 45.4994H2.16797V32.4993H15.168V36.8327H9.79464C13.283 42.0544 19.2413 45.4994 26.0013 45.4994C31.173 45.4994 36.1329 43.4449 39.7899 39.7879C43.4468 36.131 45.5013 31.1711 45.5013 25.9993H49.8346C49.8346 39.1727 39.1746 49.8327 26.0013 49.8327C17.9413 49.8327 10.813 45.8243 6.5013 39.7144V45.4994ZM2.16797 25.9993C2.16797 12.826 12.828 2.16602 26.0013 2.16602C34.0613 2.16602 41.1896 6.17435 45.5013 12.2843V6.49935H49.8346V19.4993H36.8346V15.166H42.208C38.7196 9.94435 32.7613 6.49935 26.0013 6.49935C20.8296 6.49935 15.8697 8.55381 12.2127 12.2108C8.55576 15.8677 6.5013 20.8276 6.5013 25.9993H2.16797Z"
                    fill="white"
                  />
                </svg>

                <h3 className="text-3xl inter font-semibold text-[#9AD35B] mt-3">
                  1:1 Redemption{" "}
                </h3>
                <p className="inter text-base font-normal text-[#BAB8B9] mt-5">
                  USDC is always redeemable through Circle at a one-to-one
                  ratio, meaning you can exchange each USDC for one US dollar at
                  any time, providing users with confidence in its stability and
                  value.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SeamlessSection;
