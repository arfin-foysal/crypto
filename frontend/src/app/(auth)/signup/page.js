"use client";
import ImageFileInput from "@/components/backend/ImageFileInput";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import apiService from "@/services/api";

const Signup = ({ handleOpenSignIn, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [countryOpen, setCountryOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("Select your country");
  const [selectedCountryId, setSelectedCountryId] = useState("");
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const handleClose = () => {
    if (typeof onClose === "function") {
      onClose();
    }
  };
  // Form data state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirm_password: "",
    full_name: "",
    id_number: "",
    verification_type: "id", // Default value
    verification_image1: null,
    verification_image2: null,
    country_id: "",
  });

  // Terms and conditions checkbox state
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Form validation errors
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const nextStep = () => {
    // Validate current step before proceeding
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        toast.success("Step completed successfully!");
        setCurrentStep(currentStep + 1);
      }
    }
  };

  // We'll remove this unused function

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  // Handle file input changes
  const handleFileChange = (name, file) => {
    setFormData({
      ...formData,
      [name]: file,
    });

    // Clear error for this field when user selects a file
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  // Get required verification images based on verification type
  const getRequiredImages = (verificationType) => {
    switch (verificationType) {
      case "ID_CARD":
        return 2; // ID Card requires 2 images (front and back)
      case "DRIVING_LICENSE":
        return 2; // Driver's License requires 2 images (front and back)
      case "PASSPORT":
        return 1; // Passport requires 1 image (main page)
      default:
        return 0; // No verification type selected
    }
  };

  // Validate each step
  const validateStep = (step) => {
    const errors = {};

    if (step === 1) {
      // Validate step 1 fields: email, password, confirm_password, country
      if (!formData.email) {
        errors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = "Email is invalid";
      }

      if (!formData.password) {
        errors.password = "Password is required";
      } else if (formData.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
      }

      if (!formData.confirm_password) {
        errors.confirm_password = "Please confirm your password";
      } else if (formData.password !== formData.confirm_password) {
        errors.confirm_password = "Passwords do not match";
      }

      if (!selectedCountryId) {
        errors.country_id = "Please select a country";
      } else {
        // Set country_id in formData
        setFormData({
          ...formData,
          country_id: selectedCountryId,
        });
      }
    } else if (step === 2) {
      // Validate step 2 fields: full_name, id_number, verification_type, verification_images
      if (!formData.full_name) {
        errors.full_name = "Full name is required";
      }

      if (!formData.id_number) {
        errors.id_number = "ID/passport number is required";
      }

      if (!formData.verification_type) {
        errors.verification_type = "Please select an ID type";
      } else {
        // Validate verification images based on verification type
        const requiredImages = getRequiredImages(formData.verification_type);

        if (requiredImages >= 1 && !formData.verification_image1) {
          errors.verification_image1 = `Please upload the front side of your ${
            formData.verification_type === "PASSPORT"
              ? "Passport"
              : formData.verification_type === "DRIVING_LICENSE"
              ? "Driving License"
              : "ID Card"
          }`;
        }

        if (requiredImages >= 2 && !formData.verification_image2) {
          errors.verification_image2 = `Please upload the back side of your ${
            formData.verification_type === "DRIVING_LICENSE"
              ? "Driving License"
              : "ID Card"
          }`;
        }
      }

      // Validate terms and conditions checkbox
      if (!termsAccepted) {
        errors.terms = "You must accept the terms and conditions to continue";
      }
    }

    setFormErrors(errors);

    // Show toast notification for the first error
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      toast.error(firstError);
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Always update country_id from selectedCountryId before submission
    // This ensures the latest selected country is used
    const updatedFormData = {
      ...formData,
      country_id: selectedCountryId,
    };

    // Update the form data state
    setFormData(updatedFormData);

    // Validate step 2 before submission
    if (!validateStep(2)) {
      return;
    }

    try {
      setIsSubmitting(true);

      // Create FormData object for file uploads
      const formDataObj = new FormData();

      // Add required fields exactly as expected by the API
      formDataObj.append("email", updatedFormData.email);
      formDataObj.append("password", updatedFormData.password);
      formDataObj.append("confirm_password", updatedFormData.confirm_password);
      formDataObj.append("full_name", updatedFormData.full_name);
      formDataObj.append("country_id", updatedFormData.country_id);
      formDataObj.append(
        "verification_type",
        updatedFormData.verification_type
      );
      formDataObj.append("id_number", updatedFormData.id_number);

      // Only add verification images if they exist
      if (updatedFormData.verification_image1) {
        formDataObj.append(
          "verification_image1",
          updatedFormData.verification_image1
        );
      }

      if (updatedFormData.verification_image2) {
        formDataObj.append(
          "verification_image2",
          updatedFormData.verification_image2
        );
      }
      const response = await apiService.register(formDataObj);
      if (
        response.status === true ||
        (response.data && response.data.status === true)
      ) {
        // Registration successful
        toast.success(
          "Registration successful! Please check your email to verify your account."
        );
        setRegistrationSuccess(true);
        setCurrentStep(3);
      } else if (response.errors) {
        toast.error(response.errors);
        setError(response.errors);
      } else if (response.message) {
        // API returned an error message
        toast.error(response.message);
        setError(response.message);
      } else {
        // Unknown error
        const errorMessage = "Registration failed. Please try again.";
        toast.error(errorMessage);
        setError(errorMessage);
      }
    } catch (err) {
      const errorMessage =
        "An error occurred during registration. Please try again.";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch countries from API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.getCountries();
        if (response.data && Array.isArray(response.data)) {
          setCountries(response.data);
        }
      } catch (err) {
        console.error("Error fetching countries:", err);
        setError("Failed to load countries. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <div className="mt-5 w-full">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                  <label
                    htmlFor="currency"
                    className="block text-sm font-medium "
                  >
                    Country
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      className="w-full h-12 flex items-center justify-between px-3 py-2 border border-[#777576] rounded-md text-[#777576]"
                      onClick={() => setCountryOpen(!countryOpen)}
                    >
                      <div className="flex items-center">
                        <svg
                          width={20}
                          height={20}
                          className="mr-2"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M0 4.80938V5.96563H20V4.80938H0ZM18.3333 2.5H1.66667C0.924231 2.5 0.295178 2.98545 0.0796099 3.65625H19.9204C19.7048 2.98545 19.0758 2.5 18.3333 2.5ZM20 7.11562H0V8.27187H20V7.11562ZM20 9.42188H0V10.5781H20V9.42188ZM20 11.7344H0V12.8844H20V11.7344ZM20 14.0375H0V15.1938H20V14.0375ZM19.9204 16.3438H0.0796101C0.295178 17.0145 0.92423 17.5 1.66667 17.5H18.3333C19.0758 17.5 19.7048 17.0145 19.9204 16.3438Z"
                            fill="#BD3D44"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M0 3.65625H20V4.80937H0V3.65625ZM0 5.9625H20V7.11562H0V5.9625ZM0 8.26875H20V9.425H0V8.26875ZM0 10.5781H20V11.7344H0V10.5781ZM0 12.8844H20V14.0406H0V12.8844ZM0 15.1906H20V16.3469H0V15.1906Z"
                            fill="white"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M1.66667 2.5C0.746192 2.5 0 3.24619 0 4.16667V10.5781H11.4V2.5H1.66667Z"
                            fill="#192F5D"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M0.950391 2.84375L1.05664 3.16562H1.38789L1.11914 3.3625L1.22227 3.68438L0.950391 3.48438L0.681641 3.68125L0.781641 3.3625L0.509766 3.16562H0.850391L0.950391 2.84375ZM2.85039 2.84375L2.95352 3.16562H3.29102L3.01914 3.3625L3.11914 3.68438L2.85039 3.48438L2.57852 3.68125L2.68164 3.3625L2.41289 3.16562H2.74414L2.85039 2.84375ZM4.75039 2.84375L4.85352 3.16562H5.18789L4.91914 3.3625L5.02226 3.68438L4.75039 3.48438L4.47852 3.68125L4.58164 3.3625L4.30977 3.16562H4.64727L4.75039 2.84375ZM6.65039 2.84375L6.75352 3.16562H7.09102L6.81914 3.3625L6.92227 3.68438L6.65039 3.48438L6.37852 3.68125L6.48477 3.3625L6.20977 3.16562H6.54414L6.65039 2.84375ZM8.55039 2.84375L8.65352 3.16562H8.98789L8.71914 3.3625L8.82226 3.68438L8.55039 3.48438L8.27851 3.68125L8.38164 3.3625L8.11289 3.16562H8.44726L8.55039 2.84375ZM10.4504 2.84375L10.5535 3.16562H10.891L10.616 3.3625L10.7223 3.68438L10.4504 3.48438L10.1785 3.68125L10.2848 3.3625L10.0098 3.16562H10.3473L10.4504 2.84375ZM1.90039 3.65625L2.00352 3.975H2.34414L2.07227 4.16875L2.17227 4.49063L1.90664 4.29375L1.63477 4.49063L1.73164 4.16875L1.46914 3.975H1.80352L1.90039 3.65625ZM3.80039 3.65625L3.90664 3.975H4.24102L3.96602 4.16875L4.07227 4.49063L3.80039 4.29375L3.52852 4.49063L3.63164 4.16875L3.35977 3.975H3.69727L3.80039 3.65625ZM5.70039 3.65625L5.80351 3.975H6.14102L5.86914 4.16875L5.97227 4.49063L5.70039 4.29375L5.42852 4.49063L5.53164 4.16875L5.26289 3.975H5.59414L5.70039 3.65625ZM7.60039 3.65625L7.70664 3.975H8.04101L7.76602 4.16875L7.87226 4.49063L7.60039 4.29375L7.33164 4.49063L7.43164 4.16875L7.15977 3.975H7.50039L7.60039 3.65625ZM9.50039 3.65625L9.60351 3.975H9.94102L9.66914 4.16875L9.77227 4.49063L9.50039 4.29375L9.22851 4.49063L9.33164 4.16875L9.06289 3.975H9.39727L9.50039 3.65625ZM0.950391 4.45625L1.05664 4.78125H1.38789L1.11914 4.97813L1.22227 5.29688L0.950391 5.1L0.681641 5.29688L0.781641 4.97813L0.509766 4.78125H0.850391L0.950391 4.45625ZM2.85039 4.45625L2.95352 4.78125H3.29102L3.01914 4.97813L3.11914 5.29688L2.85039 5.1L2.57852 5.29688L2.68164 4.975L2.41289 4.77813H2.74414L2.85039 4.45625ZM4.75039 4.45625L4.85352 4.77813H5.18789L4.91914 4.975L5.02226 5.29375L4.75039 5.09687L4.47852 5.29375L4.58164 4.97187L4.30977 4.775H4.64727L4.75039 4.45625ZM6.65039 4.45625L6.75352 4.77813H7.09102L6.81914 4.975L6.92227 5.29375L6.65039 5.09687L6.37852 5.29375L6.48477 4.97187L6.20977 4.775H6.54414L6.65039 4.45625ZM8.55039 4.45625L8.65352 4.77813H8.98789L8.71914 4.975L8.82226 5.29375L8.55039 5.09687L8.27851 5.29375L8.38164 4.97187L8.11289 4.775H8.44726L8.55039 4.45625ZM10.4504 4.45625L10.5535 4.77813H10.891L10.616 4.975L10.7223 5.29375L10.4504 5.09687L10.1785 5.29375L10.2848 4.97187L10.0098 4.775H10.3473L10.4504 4.45625ZM1.90039 5.26875L2.00352 5.5875H2.34414L2.07227 5.78438L2.17539 6.10625L1.90352 5.90625L1.63164 6.10313L1.73477 5.78438L1.46602 5.5875H1.80039L1.90039 5.26875ZM3.80039 5.26875L3.90664 5.5875H4.24102L3.96602 5.78438L4.07227 6.10625L3.80039 5.90625L3.52852 6.10313L3.63164 5.78438L3.35977 5.5875H3.69727L3.80039 5.26875ZM5.70039 5.26875L5.80351 5.5875H6.14102L5.86914 5.78438L5.97227 6.10625L5.70039 5.90625L5.42852 6.10313L5.53164 5.78438L5.26289 5.5875H5.59414L5.70039 5.26875ZM7.60039 5.26875L7.70664 5.5875H8.04101L7.76914 5.78438L7.87226 6.10625L7.60039 5.90625L7.33164 6.10313L7.43164 5.78438L7.15977 5.5875H7.50039L7.60039 5.26875ZM9.50039 5.26875L9.60351 5.5875H9.94102L9.66914 5.78438L9.77227 6.10625L9.50039 5.90625L9.22851 6.10313L9.33164 5.78438L9.06289 5.5875H9.39727L9.50039 5.26875ZM0.950391 6.07812L1.05664 6.39687H1.38789L1.11914 6.59375L1.22227 6.91563L0.950391 6.71562L0.681641 6.9125L0.781641 6.59375L0.509766 6.39687H0.850391L0.950391 6.07812ZM2.85039 6.07812L2.95352 6.39687H3.29102L3.01914 6.59375L3.11914 6.9125L2.85039 6.71562L2.57852 6.9125L2.68164 6.59375L2.41289 6.39687H2.74414L2.85039 6.07812ZM4.75039 6.07812L4.85352 6.39687H5.18789L4.91914 6.59375L5.02226 6.91563L4.75039 6.71562L4.47852 6.9125L4.58164 6.59375L4.30977 6.39687H4.64727L4.75039 6.07812ZM6.65039 6.07812L6.75352 6.39687H7.09102L6.81914 6.59375L6.92227 6.91563L6.65039 6.71562L6.37852 6.9125L6.48477 6.59375L6.20977 6.39687H6.54414L6.65039 6.07812ZM8.55039 6.07812L8.65352 6.39687H8.98789L8.71914 6.59375L8.82226 6.91563L8.55039 6.71562L8.27851 6.9125L8.38164 6.59375L8.11289 6.39687H8.44726L8.55039 6.07812ZM10.4504 6.07812L10.5535 6.39687H10.891L10.616 6.59375L10.7223 6.91563L10.4504 6.71562L10.1785 6.9125L10.2816 6.59375L10.0066 6.39687H10.3441L10.4504 6.07812ZM1.90039 6.88438L2.00352 7.20625H2.34414L2.07227 7.4L2.17539 7.72188L1.90352 7.52187L1.63164 7.72188L1.73477 7.4L1.46602 7.20312H1.80039L1.90039 6.88438ZM3.80039 6.88438L3.90664 7.20625H4.24102L3.96602 7.4L4.07227 7.72188L3.80039 7.52187L3.52852 7.72188L3.63164 7.4L3.35977 7.20312H3.69727L3.80039 6.88438ZM5.70039 6.88438L5.80351 7.20625H6.14102L5.86914 7.4L5.97227 7.72188L5.70039 7.52187L5.42852 7.72188L5.53164 7.4L5.26289 7.20312H5.59414L5.70039 6.88438ZM7.60039 6.88438L7.70664 7.20625H8.04101L7.76914 7.4L7.87226 7.72188L7.60039 7.52187L7.33164 7.72188L7.43164 7.4L7.15977 7.20312H7.50039L7.60039 6.88438ZM9.50039 6.88438L9.60351 7.20625H9.94102L9.66914 7.4L9.77227 7.72188L9.50039 7.52187L9.22851 7.72188L9.33164 7.4L9.06289 7.20312H9.39727L9.50039 6.88438ZM0.950391 7.69063L1.05664 8.0125H1.38789L1.11914 8.20937L1.22227 8.525L0.950391 8.33125L0.681641 8.525L0.781641 8.20625L0.509766 8.00938H0.850391L0.950391 7.69063ZM2.85039 7.69063L2.95352 8.0125H3.29102L3.01914 8.20937L3.12227 8.525L2.85039 8.33125L2.57852 8.525L2.68477 8.20625L2.41289 8.00938H2.74414L2.85039 7.69063ZM4.75039 7.69063L4.85352 8.0125H5.18789L4.91914 8.20937L5.02226 8.525L4.75039 8.33125L4.47852 8.525L4.58164 8.20625L4.30977 8.00938H4.64727L4.75039 7.69063ZM6.65039 7.69063L6.75352 8.0125H7.09102L6.81914 8.20937L6.92227 8.525L6.65039 8.33125L6.37852 8.525L6.48477 8.20625L6.20977 8.00938H6.54414L6.65039 7.69063ZM8.55039 7.69063L8.65352 8.0125H8.98789L8.71914 8.20937L8.82226 8.525L8.55039 8.33125L8.27851 8.525L8.38164 8.20625L8.11289 8.00938H8.44726L8.55039 7.69063ZM10.4504 7.69063L10.5535 8.0125H10.891L10.616 8.20937L10.7223 8.525L10.4504 8.33125L10.1785 8.525L10.2848 8.20625L10.0098 8.00938H10.3473L10.4504 7.69063ZM1.90039 8.5L2.00352 8.81875H2.34414L2.07227 9.01563L2.17539 9.3375L1.90352 9.1375L1.63164 9.33437L1.73477 9.01563L1.46602 8.81875H1.80039L1.90039 8.5ZM3.80039 8.5L3.90664 8.81875H4.24102L3.96602 9.01563L4.07227 9.3375L3.80039 9.1375L3.52852 9.33437L3.63164 9.01563L3.35977 8.81875H3.69727L3.80039 8.5ZM5.70039 8.5L5.80351 8.81875H6.14102L5.86914 9.01563L5.97227 9.3375L5.70039 9.1375L5.42852 9.33437L5.53164 9.01563L5.26289 8.81875H5.59414L5.70039 8.5ZM7.60039 8.5L7.70664 8.81875H8.04101L7.76914 9.01563L7.87226 9.3375L7.60039 9.1375L7.33164 9.33437L7.43164 9.01563L7.15977 8.81875H7.50039L7.60039 8.5ZM9.50039 8.5L9.60351 8.81875H9.94102L9.66914 9.01563L9.77227 9.3375L9.50039 9.1375L9.22851 9.33437L9.33164 9.01563L9.06289 8.81875H9.39727L9.50039 8.5ZM0.950391 9.30937L1.05664 9.62813H1.38789L1.11914 9.825L1.22227 10.1438L0.950391 9.94688L0.681641 10.1438L0.781641 9.82188L0.509766 9.625H0.850391L0.950391 9.30937ZM2.85039 9.30937L2.95352 9.62813H3.29102L3.01914 9.825L3.12227 10.1438L2.85039 9.94688L2.57852 10.1438L2.68477 9.82188L2.41289 9.625H2.74414L2.85039 9.30937ZM4.75039 9.30937L4.85352 9.62813H5.18789L4.92539 9.825L5.02851 10.1438L4.75664 9.94688L4.48477 10.1438L4.58789 9.82188L4.31602 9.625H4.65351L4.75039 9.30937ZM6.65039 9.30937L6.75352 9.62813H7.09102L6.81914 9.825L6.92227 10.1438L6.65039 9.94688L6.37852 10.1438L6.48477 9.82188L6.20977 9.625H6.54414L6.65039 9.30937ZM8.55039 9.30937L8.65352 9.62813H8.98789L8.71914 9.825L8.82226 10.1438L8.55039 9.94688L8.27851 10.1438L8.38164 9.82188L8.11289 9.625H8.44726L8.55039 9.30937ZM10.4504 9.30937L10.5535 9.62813H10.891L10.616 9.825L10.7223 10.1438L10.4504 9.94688L10.1785 10.1438L10.2848 9.82188L10.0098 9.625H10.3473L10.4504 9.30937Z"
                            fill="white"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M18.3333 3.08333H1.66667C1.06836 3.08333 0.583333 3.56836 0.583333 4.16667V15.8333C0.583333 16.4316 1.06836 16.9167 1.66667 16.9167H18.3333C18.9316 16.9167 19.4167 16.4316 19.4167 15.8333V4.16667C19.4167 3.56836 18.9316 3.08333 18.3333 3.08333ZM1.66667 2.5C0.746192 2.5 0 3.24619 0 4.16667V15.8333C0 16.7538 0.746192 17.5 1.66667 17.5H18.3333C19.2538 17.5 20 16.7538 20 15.8333V4.16667C20 3.24619 19.2538 2.5 18.3333 2.5H1.66667Z"
                            fill="#DFDFDF"
                          />
                        </svg>

                        <p className="text-sm font-normal inter">
                          {selectedCountry}
                        </p>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`transition-transform ${
                          countryOpen ? "rotate-180" : ""
                        }`}
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>

                    {countryOpen && (
                      <div className="absolute z-10 w-full mt-1 border border-[#777576] rounded-md shadow-lg bg-white max-h-60 overflow-y-auto">
                        {isLoading ? (
                          <div className="flex items-center justify-center p-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#648A3A]"></div>
                          </div>
                        ) : error ? (
                          <div className="text-red-500 p-3 text-center">
                            {error}
                          </div>
                        ) : countries.length === 0 ? (
                          <div className="text-gray-500 p-3 text-center">
                            No countries available
                          </div>
                        ) : (
                          countries.map((country) => (
                            <div
                              key={country.id}
                              className="flex items-center px-3 py-2 cursor-pointer text-[#777576] hover:bg-gray-100"
                              onClick={() => {
                                setSelectedCountry(country.name);
                                setSelectedCountryId(country.id);
                                setCountryOpen(false);
                              }}
                            >
                              <p className="text-sm font-normal inter">
                                {country.name} ({country.code})
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="email"
                      className="block text-base inter font-semibold tracking-[-0.08px] "
                    >
                      Email
                    </label>
                  </div>
                  <div className="mt-2 relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        width={16}
                        height={16}
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M14.95 3.684L8.637 8.912C8.45761 9.06063 8.23196 9.14196 7.999 9.14196C7.76604 9.14196 7.54039 9.06063 7.361 8.912L1.051 3.684C1.01714 3.78591 0.999922 3.89261 1 4V12C1 12.2652 1.10536 12.5196 1.29289 12.7071C1.48043 12.8946 1.73478 13 2 13H14C14.2652 13 14.5196 12.8946 14.7071 12.7071C14.8946 12.5196 15 12.2652 15 12V4C15.0004 3.89267 14.9835 3.78597 14.95 3.684ZM2 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V12C16 12.5304 15.7893 13.0391 15.4142 13.4142C15.0391 13.7893 14.5304 14 14 14H2C1.46957 14 0.960859 13.7893 0.585786 13.4142C0.210714 13.0391 0 12.5304 0 12V4C0 3.46957 0.210714 2.96086 0.585786 2.58579C0.960859 2.21071 1.46957 2 2 2ZM1.79 3L7.366 7.603C7.54459 7.7505 7.76884 7.83144 8.00046 7.83199C8.23209 7.83254 8.45672 7.75266 8.636 7.606L14.268 3H1.79Z"
                          fill="#777576"
                        />
                      </svg>
                    </div>

                    <input
                      type="email"
                      name="email"
                      id="email"
                      autoComplete="email"
                      required
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`block w-full h-12 rounded-md bg-white px-3 py-3 text-base text-[#777576] border ${
                        formErrors.email ? "border-red-500" : "border-[#777576]"
                      } placeholder:text-[#777576] sm:text-sm ps-10 inter font-normal`}
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-base inter font-semibold tracking-[-0.08px] "
                    >
                      Password
                    </label>
                  </div>
                  <div className="mt-2 relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3.5 7C3.36739 7 3.24021 7.05268 3.14645 7.14645C3.05268 7.24021 3 7.36739 3 7.5V13.5C3 13.6326 3.05268 13.7598 3.14645 13.8536C3.24021 13.9473 3.36739 14 3.5 14H12.5C12.6326 14 12.7598 13.9473 12.8536 13.8536C12.9473 13.7598 13 13.6326 13 13.5V7.5C13 7.36739 12.9473 7.24021 12.8536 7.14645C12.7598 7.05268 12.6326 7 12.5 7H3.5ZM3.5 6H12.5C12.8978 6 13.2794 6.15804 13.5607 6.43934C13.842 6.72064 14 7.10218 14 7.5V13.5C14 13.8978 13.842 14.2794 13.5607 14.5607C13.2794 14.842 12.8978 15 12.5 15H3.5C3.10218 15 2.72064 14.842 2.43934 14.5607C2.15804 14.2794 2 13.8978 2 13.5V7.5C2 7.10218 2.15804 6.72064 2.43934 6.43934C2.72064 6.15804 3.10218 6 3.5 6Z"
                          fill="#777576"
                        />
                        <path
                          d="M8 8.5C8.13261 8.5 8.25979 8.55268 8.35355 8.64645C8.44732 8.74021 8.5 8.86739 8.5 9V12C8.5 12.1326 8.44732 12.2598 8.35355 12.3536C8.25979 12.4473 8.13261 12.5 8 12.5C7.86739 12.5 7.74021 12.4473 7.64645 12.3536C7.55268 12.2598 7.5 12.1326 7.5 12V9C7.5 8.86739 7.55268 8.74021 7.64645 8.64645C7.74021 8.55268 7.86739 8.5 8 8.5ZM11 6V5C11 4.20435 10.6839 3.44129 10.1213 2.87868C9.55871 2.31607 8.79565 2 8 2C7.20435 2 6.44129 2.31607 5.87868 2.87868C5.31607 3.44129 5 4.20435 5 5V6H11ZM8 1C9.06087 1 10.0783 1.42143 10.8284 2.17157C11.5786 2.92172 12 3.93913 12 5V7H4V5C4 3.93913 4.42143 2.92172 5.17157 2.17157C5.92172 1.42143 6.93913 1 8 1Z"
                          fill="#777576"
                        />
                      </svg>
                    </div>

                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      name="password"
                      id="password"
                      placeholder="Enter your Password"
                      className={`block w-full rounded-md bg-white px-3 py-3 text-base text-[#777576] border ${
                        formErrors.password
                          ? "border-red-500"
                          : "border-[#777576]"
                      } placeholder:text-[#777576] h-12 sm:text-sm ps-10 inter font-normal`}
                    />
                    {formErrors.password && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.password}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-base inter font-semibold tracking-[-0.08px] "
                    >
                      Confirm password
                    </label>
                  </div>
                  <div className="mt-2 relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3.5 7C3.36739 7 3.24021 7.05268 3.14645 7.14645C3.05268 7.24021 3 7.36739 3 7.5V13.5C3 13.6326 3.05268 13.7598 3.14645 13.8536C3.24021 13.9473 3.36739 14 3.5 14H12.5C12.6326 14 12.7598 13.9473 12.8536 13.8536C12.9473 13.7598 13 13.6326 13 13.5V7.5C13 7.36739 12.9473 7.24021 12.8536 7.14645C12.7598 7.05268 12.6326 7 12.5 7H3.5ZM3.5 6H12.5C12.8978 6 13.2794 6.15804 13.5607 6.43934C13.842 6.72064 14 7.10218 14 7.5V13.5C14 13.8978 13.842 14.2794 13.5607 14.5607C13.2794 14.842 12.8978 15 12.5 15H3.5C3.10218 15 2.72064 14.842 2.43934 14.5607C2.15804 14.2794 2 13.8978 2 13.5V7.5C2 7.10218 2.15804 6.72064 2.43934 6.43934C2.72064 6.15804 3.10218 6 3.5 6Z"
                          fill="#777576"
                        />
                        <path
                          d="M8 8.5C8.13261 8.5 8.25979 8.55268 8.35355 8.64645C8.44732 8.74021 8.5 8.86739 8.5 9V12C8.5 12.1326 8.44732 12.2598 8.35355 12.3536C8.25979 12.4473 8.13261 12.5 8 12.5C7.86739 12.5 7.74021 12.4473 7.64645 12.3536C7.55268 12.2598 7.5 12.1326 7.5 12V9C7.5 8.86739 7.55268 8.74021 7.64645 8.64645C7.74021 8.55268 7.86739 8.5 8 8.5ZM11 6V5C11 4.20435 10.6839 3.44129 10.1213 2.87868C9.55871 2.31607 8.79565 2 8 2C7.20435 2 6.44129 2.31607 5.87868 2.87868C5.31607 3.44129 5 4.20435 5 5V6H11ZM8 1C9.06087 1 10.0783 1.42143 10.8284 2.17157C11.5786 2.92172 12 3.93913 12 5V7H4V5C4 3.93913 4.42143 2.92172 5.17157 2.17157C5.92172 1.42143 6.93913 1 8 1Z"
                          fill="#777576"
                        />
                      </svg>
                    </div>

                    <input
                      id="confirm_password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirm_password}
                      onChange={handleInputChange}
                      name="confirm_password"
                      placeholder="Confirm your Password"
                      className={`block w-full rounded-md bg-white px-3 py-3 text-base text-gray-900 border ${
                        formErrors.confirm_password
                          ? "border-red-500"
                          : "border-[#777576]"
                      } placeholder:text-[#777576] h-12 sm:text-sm ps-10 inter font-normal`}
                    />
                    {formErrors.confirm_password && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.confirm_password}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-[#777576]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-[#777576]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  {formErrors.country_id && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.country_id}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex font-semibold inter text-base w-full justify-center rounded-lg bg-[#648A3A] px-3 py-3 tracking-[-0.18px] text-white shadow-xs cursor-pointer"
                  >
                    Continue{" "}
                  </button>
                </div>
              </form>

              <p className="text-center font-semibold inter text-base tracking-[-0.18px] mt-5">
                Already have an account?{" "}
                <button
                  onClick={handleOpenSignIn}
                  type="button"
                  className="font-semibold text-[#648A3A] cursor-pointer"
                >
                  Sign in.
                </button>
              </p>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="step-content">
            <div className="mt-5 w-full">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="name"
                      className="block text-base inter font-semibold tracking-[-0.08px] "
                    >
                      Full name
                    </label>
                  </div>
                  <div className="mt-2 relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14.431 13.2497C13.4791 11.6041 12.0122 10.4241 10.3003 9.86475C11.1471 9.36066 11.805 8.59255 12.173 7.67837C12.5409 6.76419 12.5987 5.7545 12.3372 4.80435C12.0758 3.85419 11.5098 3.01612 10.7259 2.41883C9.94213 1.82153 8.98392 1.49805 7.99846 1.49805C7.013 1.49805 6.05479 1.82153 5.27098 2.41883C4.48716 3.01612 3.92108 3.85419 3.65967 4.80435C3.39826 5.7545 3.45598 6.76419 3.82395 7.67837C4.19193 8.59255 4.84981 9.36066 5.69659 9.86475C3.98471 10.4235 2.51784 11.6035 1.56596 13.2497C1.53105 13.3067 1.5079 13.37 1.49787 13.436C1.48783 13.502 1.49112 13.5694 1.50754 13.6341C1.52396 13.6988 1.55317 13.7596 1.59346 13.8128C1.63374 13.8661 1.68428 13.9107 1.7421 13.9441C1.79992 13.9775 1.86384 13.999 1.93009 14.0073C1.99634 14.0156 2.06358 14.0105 2.12785 13.9924C2.19211 13.9743 2.2521 13.9435 2.30426 13.9018C2.35643 13.8601 2.39972 13.8084 2.43159 13.7497C3.60909 11.7147 5.69034 10.4997 7.99846 10.4997C10.3066 10.4997 12.3878 11.7147 13.5653 13.7497C13.5972 13.8084 13.6405 13.8601 13.6927 13.9018C13.7448 13.9435 13.8048 13.9743 13.8691 13.9924C13.9333 14.0105 14.0006 14.0156 14.0668 14.0073C14.1331 13.999 14.197 13.9775 14.2548 13.9441C14.3126 13.9107 14.3632 13.8661 14.4035 13.8128C14.4438 13.7596 14.473 13.6988 14.4894 13.6341C14.5058 13.5694 14.5091 13.502 14.4991 13.436C14.489 13.37 14.4659 13.3067 14.431 13.2497ZM4.49846 5.99975C4.49846 5.30751 4.70373 4.63082 5.08832 4.05525C5.4729 3.47968 6.01953 3.03108 6.65907 2.76617C7.29861 2.50126 8.00234 2.43195 8.68128 2.567C9.36021 2.70205 9.98385 3.03539 10.4733 3.52487C10.9628 4.01436 11.2962 4.638 11.4312 5.31693C11.5663 5.99586 11.4969 6.6996 11.232 7.33914C10.9671 7.97868 10.5185 8.52531 9.94296 8.90989C9.36738 9.29448 8.69069 9.49975 7.99846 9.49975C7.07051 9.49875 6.18085 9.12969 5.52468 8.47353C4.86852 7.81736 4.49945 6.9277 4.49846 5.99975Z"
                          fill="#777576"
                        />
                      </svg>
                    </div>

                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      name="full_name"
                      id="full_name"
                      placeholder="Enter your full name"
                      className={`block w-full rounded-md bg-white px-3 py-3 text-base text-[#777576] outline-1 -outline-offset-1 outline-gray-300 placeholder:text-[#777576] h-12 sm:text-sm ps-10 inter font-normal ${
                        formErrors.full_name ? "border-red-500" : ""
                      }`}
                    />
                    {formErrors.full_name && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.full_name}
                      </p>
                    )}
                  </div>
                </div>
                <div className="">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="email"
                      className="block text-base inter font-semibold tracking-[-0.08px] "
                    >
                      ID/passport Number
                    </label>
                  </div>
                  <div className="mt-2 relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12.375 7C12.375 7.09946 12.3355 7.19484 12.2652 7.26516C12.1948 7.33549 12.0995 7.375 12 7.375H9.5C9.40054 7.375 9.30516 7.33549 9.23483 7.26516C9.16451 7.19484 9.125 7.09946 9.125 7C9.125 6.90054 9.16451 6.80516 9.23483 6.73484C9.30516 6.66451 9.40054 6.625 9.5 6.625H12C12.0995 6.625 12.1948 6.66451 12.2652 6.73484C12.3355 6.80516 12.375 6.90054 12.375 7ZM12 8.625H9.5C9.40054 8.625 9.30516 8.66451 9.23483 8.73483C9.16451 8.80516 9.125 8.90054 9.125 9C9.125 9.09946 9.16451 9.19484 9.23483 9.26517C9.30516 9.33549 9.40054 9.375 9.5 9.375H12C12.0995 9.375 12.1948 9.33549 12.2652 9.26517C12.3355 9.19484 12.375 9.09946 12.375 9C12.375 8.90054 12.3355 8.80516 12.2652 8.73483C12.1948 8.66451 12.0995 8.625 12 8.625ZM14.375 3.5V12.5C14.375 12.7321 14.2828 12.9546 14.1187 13.1187C13.9546 13.2828 13.7321 13.375 13.5 13.375H2.5C2.26794 13.375 2.04538 13.2828 1.88128 13.1187C1.71719 12.9546 1.625 12.7321 1.625 12.5V3.5C1.625 3.26794 1.71719 3.04538 1.88128 2.88128C2.04538 2.71719 2.26794 2.625 2.5 2.625H13.5C13.7321 2.625 13.9546 2.71719 14.1187 2.88128C14.2828 3.04538 14.375 3.26794 14.375 3.5ZM13.625 3.5C13.625 3.46685 13.6118 3.43505 13.5884 3.41161C13.5649 3.38817 13.5332 3.375 13.5 3.375H2.5C2.46685 3.375 2.43505 3.38817 2.41161 3.41161C2.38817 3.43505 2.375 3.46685 2.375 3.5V12.5C2.375 12.5332 2.38817 12.5649 2.41161 12.5884C2.43505 12.6118 2.46685 12.625 2.5 12.625H13.5C13.5332 12.625 13.5649 12.6118 13.5884 12.5884C13.6118 12.5649 13.625 12.5332 13.625 12.5V3.5ZM8.36312 10.4069C8.38799 10.5032 8.37358 10.6054 8.32306 10.6911C8.27254 10.7768 8.19006 10.8389 8.09375 10.8638C7.99744 10.8886 7.8952 10.8742 7.80952 10.8237C7.72384 10.7732 7.66174 10.6907 7.63688 10.5944C7.45875 9.89875 6.755 9.375 6 9.375C5.245 9.375 4.54187 9.89875 4.36312 10.5938C4.33826 10.6901 4.27616 10.7725 4.19048 10.8231C4.1048 10.8736 4.00256 10.888 3.90625 10.8631C3.80994 10.8383 3.72746 10.7762 3.67694 10.6905C3.62642 10.6048 3.61201 10.5026 3.63687 10.4062C3.72088 10.0955 3.8672 9.80501 4.06693 9.55252C4.26667 9.30003 4.51565 9.09079 4.79875 8.9375C4.50304 8.69065 4.29054 8.35872 4.19013 7.98685C4.08973 7.61497 4.10629 7.22119 4.23757 6.85906C4.36886 6.49693 4.60849 6.18401 4.92388 5.96288C5.23927 5.74174 5.61512 5.6231 6.00031 5.6231C6.38551 5.6231 6.76135 5.74174 7.07675 5.96288C7.39214 6.18401 7.63177 6.49693 7.76305 6.85906C7.89433 7.22119 7.9109 7.61497 7.81049 7.98685C7.71009 8.35872 7.49758 8.69065 7.20188 8.9375C7.48492 9.09092 7.73383 9.30029 7.93345 9.55289C8.13308 9.80549 8.27926 10.096 8.36312 10.4069ZM6 8.625C6.2225 8.625 6.44001 8.55902 6.62502 8.4354C6.81002 8.31179 6.95422 8.13609 7.03936 7.93052C7.12451 7.72495 7.14679 7.49875 7.10338 7.28052C7.05998 7.06229 6.95283 6.86184 6.7955 6.7045C6.63816 6.54717 6.43771 6.44002 6.21948 6.39662C6.00125 6.35321 5.77505 6.37549 5.56948 6.46064C5.36391 6.54578 5.18821 6.68998 5.0646 6.87498C4.94098 7.05999 4.875 7.2775 4.875 7.5C4.875 7.79837 4.99353 8.08452 5.2045 8.2955C5.41548 8.50647 5.70163 8.625 6 8.625Z"
                          fill="#777576"
                        />
                      </svg>
                    </div>

                    <input
                      type="text"
                      name="id_number"
                      id="id_number"
                      value={formData.id_number}
                      onChange={handleInputChange}
                      placeholder="Enter your ID/passport number"
                      className={`block w-full h-12 rounded-md bg-white px-3 py-3 text-base text-[#777576] outline-1 -outline-offset-1 outline-gray-300 placeholder:text-[#777576] sm:text-sm ps-10 inter font-normal ${
                        formErrors.id_number ? "border-red-500" : ""
                      }`}
                    />
                    {formErrors.id_number && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.id_number}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="large"
                    className="block text-base inter font-semibold tracking-[-0.08px] "
                  >
                    ID type{" "}
                  </label>
                  <div className="relative">
                    <svg
                      className="absolute w-4 h-4 basis-4 -translate-y-1/2 top-1/2 left-4 flex items-center"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.375 7C12.375 7.09946 12.3355 7.19484 12.2652 7.26516C12.1948 7.33549 12.0995 7.375 12 7.375H9.5C9.40054 7.375 9.30516 7.33549 9.23483 7.26516C9.16451 7.19484 9.125 7.09946 9.125 7C9.125 6.90054 9.16451 6.80516 9.23483 6.73484C9.30516 6.66451 9.40054 6.625 9.5 6.625H12C12.0995 6.625 12.1948 6.66451 12.2652 6.73484C12.3355 6.80516 12.375 6.90054 12.375 7ZM12 8.625H9.5C9.40054 8.625 9.30516 8.66451 9.23483 8.73483C9.16451 8.80516 9.125 8.90054 9.125 9C9.125 9.09946 9.16451 9.19484 9.23483 9.26517C9.30516 9.33549 9.40054 9.375 9.5 9.375H12C12.0995 9.375 12.1948 9.33549 12.2652 9.26517C12.3355 9.19484 12.375 9.09946 12.375 9C12.375 8.90054 12.3355 8.80516 12.2652 8.73483C12.1948 8.66451 12.0995 8.625 12 8.625ZM14.375 3.5V12.5C14.375 12.7321 14.2828 12.9546 14.1187 13.1187C13.9546 13.2828 13.7321 13.375 13.5 13.375H2.5C2.26794 13.375 2.04538 13.2828 1.88128 13.1187C1.71719 12.9546 1.625 12.7321 1.625 12.5V3.5C1.625 3.26794 1.71719 3.04538 1.88128 2.88128C2.04538 2.71719 2.26794 2.625 2.5 2.625H13.5C13.7321 2.625 13.9546 2.71719 14.1187 2.88128C14.2828 3.04538 14.375 3.26794 14.375 3.5ZM13.625 3.5C13.625 3.46685 13.6118 3.43505 13.5884 3.41161C13.5649 3.38817 13.5332 3.375 13.5 3.375H2.5C2.46685 3.375 2.43505 3.38817 2.41161 3.41161C2.38817 3.43505 2.375 3.46685 2.375 3.5V12.5C2.375 12.5332 2.38817 12.5649 2.41161 12.5884C2.43505 12.6118 2.46685 12.625 2.5 12.625H13.5C13.5332 12.625 13.5649 12.6118 13.5884 12.5884C13.6118 12.5649 13.625 12.5332 13.625 12.5V3.5ZM8.36312 10.4069C8.38799 10.5032 8.37358 10.6054 8.32306 10.6911C8.27254 10.7768 8.19006 10.8389 8.09375 10.8638C7.99744 10.8886 7.8952 10.8742 7.80952 10.8237C7.72384 10.7732 7.66174 10.6907 7.63688 10.5944C7.45875 9.89875 6.755 9.375 6 9.375C5.245 9.375 4.54187 9.89875 4.36312 10.5938C4.33826 10.6901 4.27616 10.7725 4.19048 10.8231C4.1048 10.8736 4.00256 10.888 3.90625 10.8631C3.80994 10.8383 3.72746 10.7762 3.67694 10.6905C3.62642 10.6048 3.61201 10.5026 3.63687 10.4062C3.72088 10.0955 3.8672 9.80501 4.06693 9.55252C4.26667 9.30003 4.51565 9.09079 4.79875 8.9375C4.50304 8.69065 4.29054 8.35872 4.19013 7.98685C4.08973 7.61497 4.10629 7.22119 4.23757 6.85906C4.36886 6.49693 4.60849 6.18401 4.92388 5.96288C5.23927 5.74174 5.61512 5.6231 6.00031 5.6231C6.38551 5.6231 6.76135 5.74174 7.07675 5.96288C7.39214 6.18401 7.63177 6.49693 7.76305 6.85906C7.89433 7.22119 7.9109 7.61497 7.81049 7.98685C7.71009 8.35872 7.49758 8.69065 7.20188 8.9375C7.48492 9.09092 7.73383 9.30029 7.93345 9.55289C8.13308 9.80549 8.27926 10.096 8.36312 10.4069ZM6 8.625C6.2225 8.625 6.44001 8.55902 6.62502 8.4354C6.81002 8.31179 6.95422 8.13609 7.03936 7.93052C7.12451 7.72495 7.14679 7.49875 7.10338 7.28052C7.05998 7.06229 6.95283 6.86184 6.7955 6.7045C6.63816 6.54717 6.43771 6.44002 6.21948 6.39662C6.00125 6.35321 5.77505 6.37549 5.56948 6.46064C5.36391 6.54578 5.18821 6.68998 5.0646 6.87498C4.94098 7.05999 4.875 7.2775 4.875 7.5C4.875 7.79837 4.99353 8.08452 5.2045 8.2955C5.41548 8.50647 5.70163 8.625 6 8.625Z"
                        fill="#777576"
                      />
                    </svg>

                    <select
                      id="verification_type"
                      name="verification_type"
                      value={formData.verification_type}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md bg-white px-3 py-3 text-base text-[#777576] outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 mt-2 sm:text-sm h-12 ps-10 inter font-normal ${
                        formErrors.verification_type ? "border-red-500" : ""
                      }`}
                    >
                      <option value="">Choose an ID Type</option>
                      <option value="DRIVING_LICENSE">Driving License</option>
                      <option value="PASSPORT">Passport</option>
                      <option value="ID_CARD">ID Card</option>
                    </select>
                    {formErrors.verification_type && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.verification_type}
                      </p>
                    )}
                  </div>
                </div>
                <div
                  className={`grid ${
                    getRequiredImages(formData.verification_type) > 1
                      ? "grid-cols-2"
                      : "grid-cols-1"
                  } gap-x-4`}
                >
                  <div className="">
                    <ImageFileInput
                      wrapperClassName="inter"
                      label={
                        formData.verification_type === "PASSPORT"
                          ? "Passport Main Page"
                          : formData.verification_type === "DRIVING_LICENSE"
                          ? "Driving License Front Side"
                          : "ID Card Front Side"
                      }
                      name="verification_image1"
                      accept="image/*"
                      isRequired={
                        getRequiredImages(formData.verification_type) >= 1
                      }
                      errors={formErrors.verification_image1}
                      value={formData.verification_image1}
                      onChange={(file) =>
                        handleFileChange("verification_image1", file)
                      }
                      helpText="Recommended Image Dimensions Max Size(10 mb)"
                    />
                    {formErrors.verification_image1 && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.verification_image1}
                      </p>
                    )}
                  </div>

                  {getRequiredImages(formData.verification_type) > 1 && (
                    <div className="">
                      <ImageFileInput
                        wrapperClassName="inter"
                        label={
                          formData.verification_type === "DRIVING_LICENSE"
                            ? "Driving License Back Side"
                            : "ID Card Back Side"
                        }
                        name="verification_image2"
                        accept="image/*"
                        isRequired={
                          getRequiredImages(formData.verification_type) >= 2
                        }
                        errors={formErrors.verification_image2}
                        value={formData.verification_image2}
                        onChange={(file) =>
                          handleFileChange("verification_image2", file)
                        }
                        helpText="Recommended Image Dimensions Max Size(10 mb)"
                      />
                      {formErrors.verification_image2 && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.verification_image2}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center mb-4">
                  <input
                    id="terms-checkbox"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    required
                    className="w-4 h-4 accent-[#648A3A] border border-[#648A3A] rounded-sm"
                  />
                  <label
                    htmlFor="terms-checkbox"
                    className="ms-2 inter text-sm font-normal "
                  >
                    I have read and agree to the terms and conditions{" "}
                  </label>
                </div>
                {formErrors.terms && (
                  <p className="text-red-500 text-xs mt-1 mb-4">
                    {formErrors.terms}
                  </p>
                )}
                <div>
                  <button
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSubmit(e);
                    }}
                    disabled={isSubmitting}
                    className="flex font-semibold inter text-base w-full justify-center rounded-lg bg-[#648A3A] px-3 py-3 tracking-[-0.18px] text-white shadow-xs cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </button>
                  {error && (
                    <div className="mt-3 text-red-500 text-sm text-center">
                      {error}
                    </div>
                  )}
                </div>
              </form>

              <p className="text-center font-semibold inter text-base tracking-[-0.18px] mt-5">
                Already have an account?{" "}
                <a href="/login" className="font-semibold text-[#648A3A]">
                  Sign in.{" "}
                </a>
              </p>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="step-content text-center h-[50vh] flex flex-col">
            <div className="grow">
              <h2 className="text-[40px] font-semibold inter  tracking-[-0.4px]">
                Congratulations!
              </h2>
              <p className="inter font-normal text-lg text-[#777576]">
                {registrationSuccess
                  ? "Your account has been created successfully!"
                  : "Please wait while we process your registration..."}
              </p>
            </div>

            <div className="flex gap-4 shrink-0">
              <Link
                href="/dashboard"
                className="flex font-semibold inter text-base w-full justify-center rounded-lg bg-[#648A3A] px-3 py-3 tracking-[-0.18px] text-white shadow-xs cursor-pointer"
              >
                Continue to dashboard
              </Link>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getStepClass = (step) => {
    if (step < currentStep) {
      return "flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 border-2 border-[#648A3A] bg-[#648A3A] text-white";
    }
    if (step === currentStep) {
      return "flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 border-2 border-[#648A3A]";
    }
    return "flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 border-2 border-[#D1D5DB]";
  };
  return (
    <>
      <div className="max-w-[484px] w-full px-8 mx-auto bg-[#141913] rounded-[20px] p-8 relative text-white        mt-12 ">
        <div className="w-full mt-4 ">
          <button
            className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white absolute top-4 right-4 cursor-pointer"
            onClick={handleClose}
          >
            <svg
              width={24}
              height={24}
              viewBox="0 0 24 24"
              className="text-white"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.6">
                <path
                  d="M19.5469 17.9541C19.7582 18.1654 19.8769 18.4521 19.8769 18.751C19.8769 19.0499 19.7582 19.3365 19.5469 19.5479C19.3355 19.7592 19.0489 19.8779 18.75 19.8779C18.4511 19.8779 18.1645 19.7592 17.9531 19.5479L12.0009 13.5938L6.04687 19.546C5.83553 19.7573 5.54888 19.8761 5.25 19.8761C4.95111 19.8761 4.66447 19.7573 4.45312 19.546C4.24178 19.3346 4.12305 19.048 4.12305 18.7491C4.12305 18.4502 4.24178 18.1636 4.45312 17.9522L10.4072 12L4.455 6.04598C4.24365 5.83464 4.12492 5.54799 4.12492 5.2491C4.12492 4.95022 4.24365 4.66357 4.455 4.45223C4.66634 4.24089 4.95299 4.12215 5.25187 4.12215C5.55076 4.12215 5.8374 4.24089 6.04875 4.45223L12.0009 10.4063L17.955 4.45129C18.1663 4.23995 18.453 4.12122 18.7519 4.12122C19.0508 4.12122 19.3374 4.23995 19.5487 4.45129C19.7601 4.66264 19.8788 4.94928 19.8788 5.24817C19.8788 5.54705 19.7601 5.8337 19.5487 6.04504L13.5947 12L19.5469 17.9541Z"
                  fill="currentColor"
                />
              </g>
            </svg>
          </button>
        </div>
        <div className="w-full">
          <h2 className="text-center text-2xl/9 font-bold tracking-tight">
            Sign up{" "}
          </h2>
        </div>

        <div className="stepper-container">
          <ol className="flex items-center w-full my-5">
            <li className="flex items-center">
              <span className={getStepClass(1)}>
                {currentStep > 1 ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : currentStep === 1 ? (
                  <div className="bg-[#648A3A] w-[10px] h-[10px] rounded-full"></div>
                ) : (
                  ""
                )}
              </span>
            </li>
            <li
              className={`flex w-full items-center before:content-[''] before:w-full before:h-1 before:border-b before:border-4 before:inline-block ${
                currentStep > 1
                  ? "before:border-[#648A3A]"
                  : "before:border-[#E5E7EB]"
              }`}
            >
              <span className={getStepClass(2)}>
                {currentStep > 2 ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : currentStep === 2 ? (
                  <div className="bg-[#648A3A] w-[10px] h-[10px] rounded-full"></div>
                ) : (
                  ""
                )}
              </span>
            </li>
            <li
              className={`flex w-full items-center before:content-[''] before:w-full before:h-1 before:border-b before:border-4 before:inline-block ${
                currentStep > 2
                  ? "before:border-[#648A3A]"
                  : "before:border-[#E5E7EB]"
              }`}
            >
              <span className={getStepClass(3)}>
                {currentStep > 3 ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : currentStep === 3 ? (
                  <div className="bg-[#648A3A] w-[10px] h-[10px] rounded-full"></div>
                ) : (
                  ""
                )}
              </span>
            </li>
            {/* <li
                className="flex w-full items-center before:content-[''] before:w-full before:h-1 before:border-b before:border-4 before:inline-block"
                style={{ "--tw-border-opacity": currentStep > 2 ? 1 : 0.1 }}
              >
                <span className={getStepClass(3)}>3</span>
              </li> */}
          </ol>

          {renderStep()}
        </div>

        {/* <ol className="flex items-center w-full my-5">
            <li className="flex items-center">
              <span className="flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 border-2 border-[#648A3A]">
                <div className=" bg-[#648A3A] w-[10px] h-[10px] rounded-full"></div>
              </span>
            </li>
            <li className="flex w-full items-center before:content-[''] before:w-full before:h-1 before:border-b before:border-[#E5E7EB] before:border-4 before:inline-block">
              <span className="flex items-center border-2 border-[#D1D5DB] justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0"></span>
            </li>
            <li className="flex w-full items-center before:content-[''] before:w-full before:h-1 before:border-b before:border-[#E5E7EB] before:border-4 before:inline-block">
              <span className="flex items-center border-2 border-[#D1D5DB] justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0"></span>
            </li>
          </ol> */}
      </div>
    </>
  );
};

export default Signup;
