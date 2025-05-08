import React from "react";

const FAQItem = ({ id, question, answer, name, defaultChecked }) => {
  return (
    <>
      <div className="faq-item">
        <input
          type="radio"
          id={id}
          name={name}
          defaultChecked={defaultChecked}
        />
        <div className="faq-content">
          <label htmlFor={id} className="faq-label text-2xl font-medium inter">
            {question}
            <span className="faq-toggle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 faq-toggle-icon plus-icon text-[#99C865]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 faq-toggle-icon minus-icon text-[#99C865]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </span>
          </label>
          <div className="faq-answer-container text-lg font-normal inter">
            <div className="faq-answer">{answer}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQItem;
