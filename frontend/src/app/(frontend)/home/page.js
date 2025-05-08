import AboutUsSection from "@/components/frontend/AboutUsSection";
import AuthModal from "@/components/frontend/AuthModal";
import BlogSection from "@/components/frontend/BlogSection";
import ContentSection from "@/components/frontend/ContentSection";
import FaqSection from "@/components/frontend/FaqSection";
import FundConvertSection from "@/components/frontend/FundConvertSection";
import HelpSection from "@/components/frontend/HelpSection";
import HeroSection from "@/components/frontend/HeroSection";
import PoweredBySection from "@/components/frontend/PoweredBySection";
import SeamlessSection from "@/components/frontend/SeamlessSection";
import SecureSection from "@/components/frontend/SecureSection";
import TestimonialSection from "@/components/frontend/TestimonialSection";
import VirtualAcountSection from "@/components/frontend/VirtualAcountSection";
import VirtualSection from "@/components/frontend/VirtualSection";
import React from "react";

const Home = () => {
  return (
    <>
      <AuthModal />
      <HeroSection />
      <ContentSection />
      <VirtualSection />
      <VirtualAcountSection />
      <FundConvertSection />
      <SecureSection />
      <SeamlessSection />
      <PoweredBySection />
      <AboutUsSection />
      <TestimonialSection />
      <BlogSection />
      <HelpSection />
      <FaqSection />
    </>
  );
};

export default Home;
