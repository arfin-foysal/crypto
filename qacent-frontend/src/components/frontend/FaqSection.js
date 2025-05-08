import React from "react";
import FAQItem from "./FAQItem";

const faqData = [
  {
    question: "What is a Qacent Virtual Account?",
    answer:
      "Qacent Virtual Accounts provide global access to a U.S.-based bank account (excluding sanctioned countries). By integrating with Bridge, these accounts merge the security of conventional banking with the efficiency of the blockchain, automatically transforming all incoming funds into USDC.",
  },
  {
    question: "How do Virtual Accounts work?",
    answer:
      "Virtual Accounts work by creating a digital representation of a traditional bank account. When you open a Virtual Account, you receive unique account details that allow others to send you funds as if they were sending to a regular bank account. Behind the scenes, these funds are automatically converted to USDC cryptocurrency, giving you the benefits of both traditional banking and blockchain technology.",
  },
  {
    question: "Who Can Open A Virtual Account?",
    answer:
      "Virtual Accounts are available to individuals and businesses from most countries worldwide, excluding sanctioned territories. Applicants must complete our standard KYC (Know Your Customer) process, providing identification documents and proof of address. For businesses, additional documentation regarding company structure and beneficial ownership is required.",
  },
  {
    question: "What Are The Fees?",
    answer:
      "Our Virtual Accounts feature a transparent fee structure: a one-time setup fee of $25, no monthly maintenance fees, and a 1% fee on all incoming transactions (minimum $5, maximum $25). Outgoing USDC transfers incur network gas fees only. There are no hidden charges, and all fees are automatically calculated and displayed before confirming any transaction.",
  },
  {
    question: "When Will The Funds Land In The Account?",
    answer:
      "Funds sent to your Virtual Account typically settle within 1-2 business days for domestic transfers and 2-5 business days for international transfers. Once the funds arrive, they are automatically converted to USDC and credited to your account within minutes. You'll receive real-time notifications at each step of the process.",
  },
  {
    question: "Any SWIFT/Account Numbers?",
    answer:
      "Yes, each Virtual Account comes with complete banking details including a unique account number, routing number for domestic transfers, and SWIFT code for international transfers. These details can be used just like a traditional bank account, allowing you to receive funds from anywhere in the world through standard banking channels.",
  },
  {
    question: "What Transactions Can Non-US Accounts Accept?",
    answer:
      "Non-US Virtual Accounts can accept wire transfers, SEPA transfers (for European accounts), and local payment methods specific to your region. They can receive funds from both individuals and businesses, and there are no restrictions on transaction purposes as long as they comply with our terms of service and relevant regulations.",
  },
  {
    question: "What Transactions Can US Accounts Residents Accept?",
    answer:
      "US-based Virtual Accounts can accept ACH transfers, wire transfers, checks via mobile deposit, and person-to-person payments from services like Zelle. These accounts support direct deposit for salaries, tax refunds, and government benefits. All standard banking transactions are supported, subject to our regular compliance monitoring.",
  },
];
const FaqSection = () => {
  return (
    <>
      <section className="pt-10 pb-20">
        <div className="max-w-7xl mx-auto bg-gradient-to-r from-[#648A3A0D] to-[#95DA661A] p-4 sm:p-6 md:p-10 border-2 border-[#FFFFFF0D] rounded-[30px]">
          <div className="w-full max-w-3xl mx-auto">
            <div className="text-center mb-12 max-w-4xl mx-auto">
              <h1 className="text-[52px] font-medium inter text-white mb-4">
                Frequently Asked Questions
              </h1>
              <p className="inter font-normal inter text-[#FFFFFF] text-xl mt-2">
                Find clear and detailed answers to the common questions our
                users ask, so you can feel confident and informed every step of
                the way.
              </p>
            </div>

            <div className="space-y-4">
              {faqData.map((item, index) => (
                <FAQItem
                  key={index}
                  id={`faq-${index}`}
                  question={item.question}
                  answer={item.answer}
                  defaultChecked={index === 0}
                  name="faq-group"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FaqSection;
