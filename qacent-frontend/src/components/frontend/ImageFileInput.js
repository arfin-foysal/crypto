import { Fragment, useEffect, useRef, useState } from "react";
import Image from "next/image";

const isValidHttpUrl = (string) => {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
};

export default function ImageFileInput({
  className = "",
  wrapperClassName = "",
  name,
  imageFlagData = null,
  label,
  accept = "image/*",
  errors = [],
  onChange,
  value = null,
  helpText = null,
  labelRightComponent = null,
}) {
  const [oldFile, setOldFile] = useState(null);
  const [file, setFile] = useState();
  const [preview, setPreview] = useState();
  const fileInput = useRef();

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);

    const img = new window.Image();
    img.src = objectUrl;
    img.onload = () => {
      console.log(`Image dimensions: ${img.width}x${img.height}`);
      URL.revokeObjectURL(objectUrl);
    };

    if (objectUrl) {
      setPreview(objectUrl);
    } else {
      setPreview(null);
    }

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  useEffect(() => {
    if (isValidHttpUrl(value)) {
      setOldFile(value);
    }
  }, [value]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setFile(undefined);
      return;
    }
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    onChange(uploadedFile, name);
  };

  const browse = () => {
    fileInput.current.click();
  };

  const remove = () => {
    setFile(null);
    onChange(null, name);
    if (fileInput.current) {
      fileInput.current.value = null;
    }
  };

  const reset = () => {
    remove();
    onChange(oldFile, name);
  };

  return (
    <div className={`w-full ${wrapperClassName}`}>
      {label && (
        <p className="block text-base font-semibold text-white">
          {label}
        </p>
      )}
      <div className="my-1">{labelRightComponent}</div>

      <div>
        <div className="flex w-full items-center justify-center relative">
          {file && oldFile && (
            <button
              type="button"
              onClick={reset}
              className="bg-red-600 text-white rounded-full px-4 py-2 text-xs absolute top-4 left-2 z-10"
            >
              Reset
            </button>
          )}

          {file ? (
            <div className="my-2 p-2 h-30 w-full flex items-center justify-center rounded-lg border-2 border-dotted border-gray-400 relative">
              {preview ? (
                <Image
                  src={preview}
                  alt="Image preview"
                  width={300}
                  height={200}
                  className="rounded-lg w-full h-full object-contain object-center"
                />
              ) : (
                <div className="rounded-lg w-full h-full flex items-center justify-center">
                  <p className="text-gray-500">Loading preview...</p>
                </div>
              )}
              <button
                type="button"
                onClick={remove}
                className="bg-red-600 text-white rounded-full p-2 text-xs absolute top-2 right-2 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <Fragment>
              {oldFile && value ? (
                <div
                  className={`my-2 p-2 h-30 w-full flex items-center justify-center rounded-lg ${
                    imageFlagData
                      ? "border-2 border-dotted border-red-500"
                      : "border-2 border-dotted border-gray-400"
                  } relative`}
                >
                  <Image
                    src={oldFile}
                    alt="Uploaded image"
                    width={300}
                    height={200}
                    className="rounded-lg w-full h-full object-contain object-center"
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={browse}
                  className={`my-2 flex h-30 w-full cursor-pointer flex-col items-center justify-center rounded-lg ${
                    imageFlagData
                      ? "border-2 border-dotted border-red-500"
                      : "border-2 border-dotted border-gray-400"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      width={52}
                      height={52}
                      viewBox="0 0 52 52"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="8.5"
                        y="7.5"
                        width={35}
                        height={35}
                        rx="5.5"
                        stroke="white"
                        strokeOpacity="0.72"
                      />
                      <path
                        d="M26 17v18m9-9H17"
                        stroke="white"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="mt-2 text-sm text-gray-400">Click to upload</p>
                  </div>
                </button>
              )}
            </Fragment>
          )}
        </div>
      </div>

      <input
        type="file"
        accept={accept}
        name={name}
        ref={fileInput}
        className="hidden"
        onChange={onSelectFile}
      />

      {errors && errors.length > 0 && (
        <div className="text-red-500 mt-1 text-sm">
          {errors.map((error, idx) => (
            <div key={idx}>{error}</div>
          ))}
        </div>
      )}

      {helpText && (
        <div className="text-gray-400 mt-1 text-sm">{helpText}</div>
      )}
    </div>
  );
}
