import React from "react";

const TextInput = ({
  multiline = false,
  label,
  name,
  className,
  errors = [],
  id = null,
  wrapperClassName = null,
  row = null,
  ...props
}) => {
  return (
    <>
      <div className={wrapperClassName}>
        {label && (
          <label
            className="text-base inter font-semibold mb-2 text-[#FFFBFD] inline-block"
            htmlFor={name}
          >
            {label}
          </label>
        )}
        {multiline ? (
          <textarea
            id={id || name}
            name={name}
            rows={row}
            {...props}
            className={`border inter font-medium border-[#6A6A6A] text-white text-xs rounded-lg outline-0 block p-2.5 ${className} ${
              errors.length ? "error" : ""
            }`}
          />
        ) : (
          <input
            id={id || name}
            name={name}
            {...props}
            className={`border inter font-medium border-[#6A6A6A] text-white text-xs rounded-lg outline-0 block  p-2.5 h-10 ${className} ${
              errors.length ? "error" : ""
            }`}
          />
        )}

        {errors && <div className="form-error">{errors}</div>}
      </div>
    </>
  );
};

export default TextInput;
