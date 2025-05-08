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
function ImageFileInput({
  className,
  wrapperClassName,
  name,
  imageFlagData = null,
  label,
  accept,
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
  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!file) {
      setPreview(null); // Use null instead of undefined
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    // Use HTMLImageElement instead of Image to avoid conflict with next/image
    let img = new window.Image();
    img.src = objectUrl;
    img.onload = function () {
      console.log(this.width + " " + this.height);
      URL.revokeObjectURL(objectUrl);
    };

    // Only set preview if objectUrl is not empty
    if (objectUrl) {
      setPreview(objectUrl);
    } else {
      setPreview(null); // Use null as fallback
    }

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  // useEffect(() => {
  // 	if (isValidHttpUrl(value)) {
  // 		setPreview(value);
  // 	}
  // }, [value]);

  useEffect(() => {
    // console.log(`Name: ${name}, value: ${value}`);
    if (isValidHttpUrl(value)) {
      setOldFile(value);
    }
  }, [value]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setFile(undefined);
      return;
    }

    // I've kept this example simple by using the first image instead of multiple
    const uploadedFile = e.target.files[0];
    // console.log(uploadedFile);
    setFile(uploadedFile);
    onChange(uploadedFile, name);
  };

  function browse() {
    fileInput.current.click();
  }

  function remove() {
    setFile(null);
    onChange(null, name);
    fileInput.current.value = null;
  }

  return (
    <div className={`w-full ${wrapperClassName}`}>
      {label ? (
        <p className="block text-base inter font-semibold tracking-[-0.08px] text-white">
          {label}
        </p>
      ) : null}
      <div className="my-1">{labelRightComponent}</div>
      <div className="">
        <div className="flex w-full items-center justify-center relative">
          {file && oldFile ? (
            <button
              type="button"
              onClick={() => {
                remove();
                onChange(oldFile, name);
              }}
              className="bg-red-600 text-white rounded-full px-4 py-2 text-xs absolute top-4 left-2 z-10"
            >
              Reset
            </button>
          ) : null}

          {file ? (
            <div className="my-2 p-2 h-30 w-full flex items-center justify-center rounded-lg border-2 border-dotted border-[#CDCDCD] bg-[#F5FFF6] relative">
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
              {file ? (
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
              ) : null}
            </div>
          ) : (
            <Fragment>
              {oldFile && value ? (
                <div
                  className={`my-2 p-2 h-30 w-full flex items-center justify-center rounded-lg ${
                    imageFlagData
                      ? "!border-2 !border-dotted !border-[#FF2727]"
                      : "border-2 border-dotted border-[#CDCDCD]"
                  } bg-[#F5FFF6] relative`}
                >
                  {oldFile && oldFile !== "" ? (
                    <Image
                      src={oldFile}
                      alt="Uploaded image"
                      width={300}
                      height={200}
                      className="rounded-lg w-full h-full object-contain object-center"
                    />
                  ) : (
                    <div className="rounded-lg w-full h-full flex items-center justify-center">
                      <p className="text-gray-500">No image available</p>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={browse}
                  className={`my-2 flex h-30 w-full cursor-pointer flex-col items-center justify-center rounded-lg ${
                    imageFlagData
                      ? "!border-2 !border-dotted !border-[#FF2727]"
                      : "border-2 border-dotted border-[#CDCDCD]"
                  } bg-[#F5FFF6]`}
                >
                  <div className="flex items-center justify-center flex-col pt-5 pb-6 ">
                    <svg
                      width={52}
                      height={52}
                      viewBox="0 0 52 52"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g filter="url(#filter0_d_561_393)">
                        <rect
                          x={8}
                          y={7}
                          width={36}
                          height={36}
                          rx={6}
                          fill="white"
                        />
                        <rect
                          x="8.5"
                          y="7.5"
                          width={35}
                          height={35}
                          rx="5.5"
                          stroke="white"
                        />
                        <path
                          d="M35.3761 25C35.3801 26.4885 34.8972 27.9373 34.0011 29.1258C33.9518 29.1915 33.89 29.2468 33.8193 29.2886C33.7486 29.3303 33.6703 29.3578 33.589 29.3693C33.5077 29.3808 33.4249 29.3762 33.3453 29.3558C33.2658 29.3353 33.191 29.2994 33.1254 29.25C33.0597 29.2007 33.0044 29.1389 32.9626 29.0682C32.9209 28.9975 32.8934 28.9192 32.8819 28.8379C32.8703 28.7565 32.8749 28.6737 32.8954 28.5942C32.9159 28.5147 32.9518 28.4399 33.0012 28.3743C33.7346 27.4026 34.1297 26.2175 34.1261 25C34.1261 23.5082 33.5335 22.0775 32.4786 21.0226C31.4237 19.9677 29.993 19.375 28.5011 19.375C27.0093 19.375 25.5786 19.9677 24.5237 21.0226C23.4688 22.0775 22.8761 23.5082 22.8761 25C22.8761 25.1658 22.8103 25.3248 22.6931 25.442C22.5759 25.5592 22.4169 25.625 22.2511 25.625C22.0854 25.625 21.9264 25.5592 21.8092 25.442C21.692 25.3248 21.6261 25.1658 21.6261 25C21.6258 24.3693 21.7123 23.7416 21.8832 23.1344C21.798 23.125 21.7121 23.125 21.6261 23.125C20.6316 23.125 19.6778 23.5201 18.9745 24.2234C18.2712 24.9266 17.8761 25.8805 17.8761 26.875C17.8761 27.8696 18.2712 28.8234 18.9745 29.5267C19.6778 30.2299 20.6316 30.625 21.6261 30.625H23.5011C23.6669 30.625 23.8259 30.6909 23.9431 30.8081C24.0603 30.9253 24.1261 31.0843 24.1261 31.25C24.1261 31.4158 24.0603 31.5748 23.9431 31.692C23.8259 31.8092 23.6669 31.875 23.5011 31.875H21.6261C20.9388 31.8752 20.2588 31.7336 19.6286 31.4592C18.9984 31.1847 18.4315 30.7833 17.9635 30.2799C17.4954 29.7766 17.1361 29.1821 16.9081 28.5337C16.6801 27.8852 16.5882 27.1967 16.6383 26.5112C16.6883 25.8256 16.8791 25.1578 17.1988 24.5493C17.5186 23.9408 17.9603 23.4048 18.4965 22.9747C19.0327 22.5446 19.6518 22.2297 20.3152 22.0497C20.9785 21.8696 21.6719 21.8282 22.3519 21.9282C23.0444 20.5431 24.1842 19.4324 25.5867 18.776C26.9892 18.1196 28.5722 17.9558 30.0794 18.3113C31.5865 18.6668 32.9295 19.5206 33.8909 20.7346C34.8522 21.9486 35.3756 23.4515 35.3761 25ZM28.3183 24.5578C28.2603 24.4997 28.1914 24.4536 28.1155 24.4222C28.0396 24.3907 27.9583 24.3745 27.8761 24.3745C27.794 24.3745 27.7127 24.3907 27.6368 24.4222C27.5609 24.4536 27.492 24.4997 27.434 24.5578L24.934 27.0578C24.8759 27.1159 24.8298 27.1849 24.7984 27.2607C24.767 27.3366 24.7508 27.4179 24.7508 27.5C24.7508 27.5822 24.767 27.6635 24.7984 27.7393C24.8298 27.8152 24.8759 27.8842 24.934 27.9422C25.0512 28.0595 25.2103 28.1254 25.3761 28.1254C25.4583 28.1254 25.5396 28.1092 25.6155 28.0778C25.6913 28.0464 25.7603 28.0003 25.8183 27.9422L27.2511 26.5086V31.25C27.2511 31.4158 27.317 31.5748 27.4342 31.692C27.5514 31.8092 27.7104 31.875 27.8761 31.875C28.0419 31.875 28.2009 31.8092 28.3181 31.692C28.4353 31.5748 28.5011 31.4158 28.5011 31.25V26.5086L29.934 27.9422C29.992 28.0003 30.061 28.0464 30.1368 28.0778C30.2127 28.1092 30.294 28.1254 30.3761 28.1254C30.4583 28.1254 30.5396 28.1092 30.6155 28.0778C30.6913 28.0464 30.7603 28.0003 30.8183 27.9422C30.8764 27.8842 30.9225 27.8152 30.9539 27.7393C30.9853 27.6635 31.0015 27.5822 31.0015 27.5C31.0015 27.4179 30.9853 27.3366 30.9539 27.2607C30.9225 27.1849 30.8764 27.1159 30.8183 27.0578L28.3183 24.5578Z"
                          fill="#101010"
                        />
                      </g>
                      <defs>
                        <filter
                          id="filter0_d_561_393"
                          x={0}
                          y={0}
                          width={52}
                          height={52}
                          filterUnits="userSpaceOnUse"
                          colorInterpolationFilters="sRGB"
                        >
                          <feFlood
                            floodOpacity={0}
                            result="BackgroundImageFix"
                          />
                          <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                          />
                          <feOffset dy={1} />
                          <feGaussianBlur stdDeviation={4} />
                          <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.16 0"
                          />
                          <feBlend
                            mode="normal"
                            in2="BackgroundImageFix"
                            result="effect1_dropShadow_561_393"
                          />
                          <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="effect1_dropShadow_561_393"
                            result="shape"
                          />
                        </filter>
                      </defs>
                    </svg>

                    <p className="text-sm inter font-normal text-[#777576]">
                      Upload photo
                    </p>
                  </div>
                </button>
              )}
            </Fragment>
          )}
          <input
            id={name}
            ref={fileInput}
            accept={accept}
            type="file"
            className="hidden"
            onChange={onSelectFile}
          />
        </div>
      </div>
      {errors && errors.length > 0 && (
        <div className="form-error">{errors}</div>
      )}
    </div>
  );
}

export default ImageFileInput;
