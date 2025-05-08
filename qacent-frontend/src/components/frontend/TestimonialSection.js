"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import TestimonialCard from "./TestimonialCard";
import "swiper/css/effect-fade";

const testimonialDatas = [
  {
    id: 1,
    img: "/assets/frontend_assets/testimonial-img.png",
    name: "Kathryn Murphy 1",
    designation: "CEO of Stripe",
    title: "What our customers are saying",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut suspendisse lectus erat curabitur at sit arcu luctus augue. Sceleriaque purus placerat scelerisque quis venenatis sollicitudin.Fermentum habitant proin iaculis tortor gravida vulputate sed justo.",
  },
  {
    id: 2,
    img: "/assets/frontend_assets/testimonial-img.png",
    name: "Kathryn Murphy 2",
    designation: "Partho Chatterjee",
    title: "What our customers are saying",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut suspendisse lectus erat curabitur at sit arcu luctus augue. Sceleriaque purus placerat scelerisque quis venenatis sollicitudin.Fermentum habitant proin iaculis tortor gravida vulputate sed justo.",
  },
  {
    id: 3,
    img: "/assets/frontend_assets/testimonial-img.png",
    name: "Kathryn Murphy 3",
    designation: "Ahsan ullah",
    title: "What our customers are saying",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut suspendisse lectus erat curabitur at sit arcu luctus augue. Sceleriaque purus placerat scelerisque quis venenatis sollicitudin.Fermentum habitant proin iaculis tortor gravida vulputate sed justo.",
  },
];
const TestimonialSection = () => {
  return (
    <>
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-20 max-w-4xl mx-auto">
              <h1 className="text-[52px] font-medium inter text-white mb-4">
                TESTIMONIALS{" "}
              </h1>
              <p className="inter font-normal inter text-[#FFFFFF] text-xl mt-2">
                Hear directly from our users and partners as they share their
                experiences, success stories, and trust in our platform on their
                journey
              </p>
            </div>
          </div>
          {/* <div className="">
            <TestimonialCard />
          </div> */}
          <div className="relative">
            <img
              src="/assets/frontend_assets/round.svg"
              alt=""
              className="absolute -bottom-15 -left-15"
            />
            <Swiper
              slidesPerView={1}
              spaceBetween={10}
              effect={"fade"}
              modules={[Navigation, EffectFade]}
              navigation={{
                nextEl: ".custom-next",
                prevEl: ".custom-prev",
              }}
              className="mySwiper"
            >
              {testimonialDatas.map((item, index) => {
                return (
                  <SwiperSlide key={index}>
                    <TestimonialCard item={item} />
                  </SwiperSlide>
                );
              })}
            </Swiper>

            <div className="flex items-center space-x-4 absolute right-0 -bottom-20">
              <button className="custom-prev cursor-pointer w-8 h-8 z-10 rounded-full text-[#95DA66] flex items-center justify-center border border-[#95DA66]">
                <svg
                  width={15}
                  height={15}
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.2125 13.5L7.525 14.1875C7.2125 14.4688 6.74375 14.4688 6.4625 14.1875L0.4 8.09375C0.0875001 7.8125 0.0875001 7.34375 0.4 7.0625L6.4625 0.96875C6.74375 0.6875 7.24375 0.6875 7.525 0.96875L8.2125 1.65625C8.525 1.96875 8.49375 2.4375 8.2125 2.75L4.43125 6.3125H13.4313C13.8375 6.3125 14.1813 6.65625 14.1813 7.0625V8.0625C14.1813 8.5 13.8375 8.8125 13.4313 8.8125H4.43125L8.2125 12.4062C8.49375 12.7188 8.525 13.1875 8.2125 13.5Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
              <button className="custom-next cursor-pointer w-8 h-8 z-10 rounded-full text-[#95DA66] flex items-center justify-center border border-[#95DA66]">
                <svg
                  width={15}
                  height={15}
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.11875 1.65625L6.80625 0.96875C7.11875 0.6875 7.5875 0.6875 7.86875 0.96875L13.9625 7.03125C14.2438 7.34375 14.2438 7.8125 13.9625 8.09375L7.86875 14.1875C7.5875 14.4688 7.11875 14.4688 6.80625 14.1875L6.11875 13.5C5.8375 13.1875 5.8375 12.7188 6.11875 12.4062L9.9 8.8125H0.93125C0.49375 8.8125 0.18125 8.5 0.18125 8.0625V7.0625C0.18125 6.65625 0.49375 6.3125 0.93125 6.3125H9.9L6.11875 2.75C5.8375 2.4375 5.80625 1.96875 6.11875 1.65625Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TestimonialSection;
