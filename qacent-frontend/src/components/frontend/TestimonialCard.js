import React from "react";

const TestimonialCard = ({ item }) => {
  console.log(item);
  return (
    <>
      <div className="grid grid-cols-5 gap-8 bg-[#1C1C1C] py-5">
        <div className="col-span-2">
          <div className="relative">
            <img src={item.img} alt="" />
          </div>
        </div>
        <div className="col-span-3">
          <p className="text-[#95DA66] poppins font-semibold text-xl uppercase mb-3">
            TESTIMONIALS
          </p>
          <h2 className="poppins text-[44px] font-semibold text-white max-w-xl leading-none">
            {item.title}
          </h2>
          <p className="poppins font-normal text-lg text-white max-w-xl mt-10">
            {item.details}
          </p>
          <div className="mt-5">
            <p className="poppins font-semibold text-xl text-white">
              {item.name}{" "}
            </p>
            <p className="poppins font-semibold text-lg text-[#888888]">
              {item.designation}{" "}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TestimonialCard;
