import React from "react";
import BlogCard from "./BlogCard";

const BlogSection = () => {
  return (
    <>
      <section className="bg-[#1C1C1C] py-10 relative">
        <img
          src="/assets/frontend_assets/blog-Ellipse.png"
          alt=""
          className="absolute left-0 w-[400px] h-[400px]"
        />
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-20 max-w-4xl mx-auto">
              <h1 className="text-[52px] font-medium inter text-white mb-4">
                Blogs & Articles{" "}
              </h1>
              <p className="inter font-normal inter text-[#FFFFFF] text-xl mt-2">
                Discover who we are, what we stand for, and how our mission
                drives us to deliver excellence every step of the way.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-16">
            <BlogCard />
            <BlogCard />
            <BlogCard />
          </div>
        </div>
        <img
          src="/assets/frontend_assets/blog-Ellipse-2.png"
          alt=""
          className="absolute right-0 bottom-0 w-[400px] h-[400px]"
        />
      </section>
    </>
  );
};

export default BlogSection;
