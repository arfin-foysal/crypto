"use client";
import TextInput from "@/components/backend/TextInput";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import apiService from "@/services/api";
import toast from "react-hot-toast";
import Breadcrumb from "@/components/backend/Breadcrumb";

const Profile = () => {
  // Form state
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    dob: "",
    address: "",
    registration_date: "", // Will be populated with formatted created_at
    photo: "",
  });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [imageFile, setImageFile] = useState(null); // State to store the actual file for upload
  const [imagePreview, setImagePreview] = useState(null); // State to store the preview URL
  const [profileImage, setProfileImage] = useState(null); // State to store the profile image URL from API
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null); // Ref to trigger file input click

  // Format date to show date and time
  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Return original if invalid date

    // Format as DD Month YYYY, HH:MM AM/PM
    const formattedDate = date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long", // Show full month name
      year: "numeric",
    });

    // Rearrange to put day first if needed
    const parts = formattedDate.split(" ");
    const formattedWithDayFirst =
      parts[1].replace(",", "") + " " + parts[0] + ", " + parts[2];

    return (
      formattedWithDayFirst +
      ", " +
      date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    );
  };

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await apiService.getProfile();
        if (response.status && response.data) {
          const profileData = response.data;
          setFormData({
            full_name: profileData.full_name || "",
            email: profileData.email || "",
            password: "", // Don't set password from API
            dob: profileData.dob || "",
            address: profileData.address || "",
            photo: profileData.photo || "",
            registration_date: formatDateTime(profileData.created_at) || "", // Format the registration date
          });

          // Set profile image if available
          if (profileData.photo) {
            setProfileImage(profileData.photo);
          }
        } else {
          setError("Failed to fetch profile data");
          toast.error("Failed to load profile data");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("An error occurred while fetching profile data");
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create a FormData object for the profile update
      const profileFormData = new FormData();

      // Add all profile fields to the FormData
      // Only include specific fields that the API expects
      profileFormData.append("full_name", formData.full_name);
      profileFormData.append("email", formData.email);
      profileFormData.append("address", formData.address);
      profileFormData.append("dob", formData.dob);

      // Only include password if it's not empty
      if (formData.password && formData.password.trim() !== "") {
        profileFormData.append("password", formData.password);
      }

      // Add the photo file if selected
      if (imageFile) {
        // Show a message about the upload
        toast.loading("Uploading profile data and photo...", {
          id: "profileUpdate",
        });
        profileFormData.append("photo", imageFile);
      } else {
        // Show a message about the update
        toast.loading("Updating profile information...", {
          id: "profileUpdate",
        });
      }

      // Log the data being sent to the API for debugging
      console.log("Sending profile update with FormData");

      // Log FormData entries for debugging
      for (let [key, value] of profileFormData.entries()) {
        if (key === "photo") {
          console.log(`FormData entry - ${key}: [File]`);
        } else if (key !== "password") {
          console.log(`FormData entry - ${key}: ${value}`);
        } else {
          console.log(`FormData entry - ${key}: [REDACTED]`);
        }
      }

      // Update profile using a single API call
      const response = await apiService.updateProfile(profileFormData);

      if (response.status) {
        // Update success toast
        toast.success("Profile updated successfully", { id: "profileUpdate" });

        // Update the profile image in the UI if returned
        if (response.data && response.data.photo) {
          setProfileImage(response.data.photo);
        }

        // Clear the image file and preview after successful upload
        if (imageFile) {
          setImageFile(null);
          setImagePreview(null);
        }

        // Refresh the page after successful update to show the latest data
        setTimeout(() => {
          window.location.reload();
        }, 2000); // Give time for the success toast to be visible
      } else {
        // Update error toast
        const errorMessage = response.message || "Failed to update profile";
        toast.error(errorMessage, { id: "profileUpdate" });

        // Log detailed error information
        console.error("Profile update error details:", {
          message: response.message,
          errors: response.errors,
          error: response.error,
        });

        // Show validation errors if available
        if (response.errors) {
          Object.entries(response.errors).forEach(([field, errors]) => {
            errors.forEach((error) => {
              toast.error(`${field}: ${error}`, { id: `error-${field}` });
            });
          });
        }
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("An error occurred while updating profile", {
        id: "profileUpdate",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size - limit to 2MB (2097152 bytes)
      const maxSize = 2 * 1024 * 1024; // 2MB

      if (file.size > maxSize) {
        toast.error(
          `File is too large. Maximum size is 2MB. Your file is ${(
            file.size /
            (1024 * 1024)
          ).toFixed(2)}MB`
        );
        return;
      }

      setImageFile(file); // Store the actual file for form submission
      const imageUrl = URL.createObjectURL(file); // Create a URL for preview
      setImagePreview(imageUrl);
    }
  };

  // Trigger file input click when camera icon is clicked
  const handleCameraClick = () => {
    fileInputRef.current.click();
  };
  // Clean up the object URL to avoid memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  return (
    <>
      <div className="w-full px-2 mt-4 md:mt-0">
        <Breadcrumb />
        <div className="bg-gradient-to-b from-[#9EDA581A] via-[#68DB9F1A] to-[#2020201A] rounded-[32px] p-8 border border-[#3B3B3B]">
          <div className="">
            <h2 className="text-xl font-semibold inter text-white mb-1">
              User Profile
            </h2>
            <p className="text-xs font-semibold inter text-[#777576]">
              Profile information details
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#648A3A]"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">{error}</div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <div className="flex flex-col items-center justify-center mt-10">
                  <div className="relative w-40 h-40 rounded-full">
                    {/* Profile Image */}
                    {imagePreview || profileImage ? (
                      <Image
                        src={
                          imagePreview ||
                          `${process.env.NEXT_PUBLIC_MEDIA_URL}${profileImage}`
                        } // Use preview or API image
                        width={150}
                        height={150}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full border-4 border-[#648A3A]"
                      />
                    ) : (
                      <svg
                        viewBox="0 0 48 48"
                        fill="none"
                        className="rounded-full w-full h-full border-4 border-[#648A3A]"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_437_12577)">
                          <rect width={48} height={48} rx={24} fill="#F3F4F6" />
                          <path
                            d="M48 41.988V48.002H0V42.01C2.7919 38.2789 6.41581 35.2507 10.5836 33.1661C14.7513 31.0815 19.348 29.9981 24.008 30.002C33.816 30.002 42.528 34.71 48 41.988ZM32.004 18C32.004 20.1217 31.1611 22.1566 29.6609 23.6569C28.1606 25.1571 26.1257 26 24.004 26C21.8823 26 19.8474 25.1571 18.3471 23.6569C16.8469 22.1566 16.004 20.1217 16.004 18C16.004 15.8783 16.8469 13.8434 18.3471 12.3431C19.8474 10.8429 21.8823 10 24.004 10C26.1257 10 28.1606 10.8429 29.6609 12.3431C31.1611 13.8434 32.004 15.8783 32.004 18Z"
                            fill="#D1D5DB"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_437_12577">
                            <rect width={48} height={48} rx={24} fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    )}

                    {/* Camera Icon */}
                    <div
                      className="absolute bottom-2 right-2 bg-[#24A664] rounded-full p-2  cursor-pointer"
                      onClick={handleCameraClick}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-5 text-white"
                      >
                        <path d="M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9Z" />
                        <path
                          fillRule="evenodd"
                          d="M9.344 3.071a49.52 49.52 0 0 1 5.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 0 0 1.11-.71l.822-1.315a2.942 2.942 0 0 1 2.332-1.39ZM6.75 12.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Zm12-1.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    {/* Hidden File Input */}
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                  {/* Name */}
                  <h2 className="mt-5 text-2xl inter font-bold capitalize gradient_text">
                    {formData.full_name}
                  </h2>
                </div>
              </div>
              <div className="col-span-2">
                <form
                  onSubmit={handleSubmit}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="mb-3">
                    <TextInput
                      className="w-full h-11 !placeholder:text-[#6B7280] !font-light bg-[#FFFFFF0D]"
                      name="full_name"
                      label="Full Name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="mb-3">
                    <TextInput
                      className="w-full h-11 !placeholder:text-[#6B7280] !font-light bg-[#FFFFFF0D]"
                      name="registration_date"
                      label="Registration Date"
                      value={formData.registration_date}
                      onChange={handleInputChange}
                      disabled={true} // Registration date should not be editable
                    />
                  </div>
                  <div className="mb-3">
                    <TextInput
                      className="w-full h-11 !placeholder:text-[#6B7280] !font-light bg-[#FFFFFF0D]"
                      name="email"
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      className="text-base inter font-semibold mb-2 text-[#FFFBFD] inline-block"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="h-11 !placeholder:text-[#6B7280] !font-light w-full px-4 py-2 bg-[#FFFFFF0D] text-white rounded-lg text-xs border inter border-[#6A6A6A]"
                        placeholder="Leave blank to keep current password"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                      >
                        {showPassword ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="mb-3">
                    <TextInput
                      className="w-full h-11 !placeholder:text-[#6B7280] !font-light bg-[#FFFFFF0D]"
                      name="dob"
                      label="Date of birth"
                      type="date"
                      value={formData.dob}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="mb-3">
                    <TextInput
                      className="w-full h-11 !placeholder:text-[#6B7280] !font-light bg-[#FFFFFF0D]"
                      name="address"
                      label="Present address"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-end col-span-2">
                    <button
                      type="button"
                      onClick={() => window.location.reload()}
                      className="cursor-pointer bg-[#FFFFFF1A] text-[#FFFBFD80] font-semibold inter text-sm py-2 px-4 rounded-full w-30 hover:bg-[#FFFFFF30] transition-colors"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="cursor-pointer text-white font-semibold inter text-sm py-2 px-4 rounded-full ml-4 w-30 bg-gradient-to-r from-[#69E1A4] to-[#648A3A] hover:opacity-90 transition-opacity flex items-center justify-center"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        "Save"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
        {/* <div className="bg-white p-8 mt-4 rounded-lg border border-[#3B3B3B] uppercase">
          <p className="text-2xl font-medium mb-4 border-b border-gray-300 pb-4">
            Transaction Id/ #bjhyddyb4y - (deposit)
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="">
              <p className="inter font-normal mb-2">Coustomer Information :</p>
              <ul className="">
                <li className="inter mb-2">
                  <span className="font-semibold mr-1">Name :</span>
                  <span>Name </span>
                </li>
                <li className="inter mb-2">
                  <span className="font-semibold mr-1">Phone Number :</span>
                  <span>Name </span>
                </li>
                <li className="inter mb-2">
                  <span className="font-semibold mr-1">Email :</span>
                  <span>Name </span>
                </li>
                <li className="inter mb-2">
                  <span className="font-semibold mr-1">Current Balance :</span>
                  <span>Name </span>
                </li>
                <li className="inter mb-2">
                  <span className="font-semibold mr-1">
                    Transaction Status :
                  </span>
                  <span className="font-semibold uppercase text-xl">
                    Complete{" "}
                  </span>
                </li>
              </ul>
            </div>
            <div className="">
              <p className="inter font-normal mb-2">
                Transaction Information :
              </p>
              <ul className="">
                <li className="inter mb-2">
                  <span className="font-semibold mr-1">To Currency :</span>
                  <span>Name </span>
                </li>
                <li className="inter mb-2">
                  <span className="font-semibold mr-1">From Currency :</span>
                  <span>Name </span>
                </li>
                <li className="inter mb-2">
                  <span className="font-semibold mr-1">Amount :</span>
                  <span>Name </span>
                </li>
                <li className="inter mb-2">
                  <span className="font-semibold mr-1">Charge Amount :</span>
                  <span>Name </span>
                </li>
                <li className="inter mb-2">
                  <span className="font-semibold mr-1">Fee Type :</span>
                  <span>Name </span>
                </li>
                <li className="inter mb-2">
                  <span className="font-semibold mr-1">Fee Amount :</span>
                  <span>Name </span>
                </li>
                <li className="inter mb-2">
                  <span className="font-semibold mr-1">Withdraw Amount :</span>
                  <span>Name </span>
                </li>
              </ul>
            </div>{" "}
          </div>
        </div>
        <div className="bg-white p-8 mt-4 rounded-lg border border-[#3B3B3B] uppercase">
          <p className="text-2xl font-medium mb-4  pb-4">
            Order Report/ #95noq1lapp
          </p>
          <div className="">
            <div className="border border-gray-300 p-4 rounded-lg shadow-sm mb-12">
              <p className="inter font-normal mb-2">Order status :</p>
              <div className="">
                <form className="">
                  <select
                    id="status"
                    name="status"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 uppercase outline-0 w-[300px] inter font-medium"
                  >
                    <option value="complete">complete</option>
                    <option value="pending">pending</option>
                    <option value="processing">processing</option>
                  </select>
                  <button className="px-4 py-2 bg-gray-800 text-white inter rounded-md ml-4 cursor-pointer">
                    Update Status
                  </button>
                </form>
              </div>
            </div>
            <div className="border border-gray-300 p-4 rounded-lg shadow-sm">
              <p className="inter font-normal mb-2">Payment status :</p>
              <div className="">
                <form className="">
                  <select
                    id="status"
                    name="status"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 uppercase outline-0 w-[300px] inter font-medium"
                  >
                    <option value="complete">complete</option>
                    <option value="pending">pending</option>
                    <option value="processing">processing</option>
                  </select>
                  <button className="px-4 py-2 bg-gray-800 text-white inter rounded-md ml-4 cursor-pointer">
                    Update Status
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default Profile;
