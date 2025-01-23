import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import Menu from "../components/Menu";
import AOS from "aos";
import "aos/dist/aos.css";
import Loader from "../components/Loader";
import axios from "axios";

const Inquiry = () => {
  const location = useLocation();
  const serviceData = location.state?.service;
  const ip = import.meta.env.VITE_IP;
  const [isLoading, setIsLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    countryCode: "+91", // Added country code with default value
    purpose_id: serviceData.id || "",
    purpose_name: serviceData.title || "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [purposes, setPurposes] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => setShowLoader(false), 1000);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      AOS.init({ duration: 1000, once: true });
    }
  }, [isLoading]);

  useEffect(() => {
    const fetchPurposes = async () => {
      try {
        const { data } = await axios.get(
          `${ip}/moox_events/api/service/get-active-services`
        );
        const serviceData = data.services.map((service) => ({
          purpose_id: service._id,
          purpose_name: service.name,
        }));
        setPurposes(serviceData);
      } catch (error) {
        console.error("Error fetching purposes:", error);
      }
    };

    fetchPurposes();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full Name is required.";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "A valid email is required.";
    if (!formData.mobile.trim() || !/^\d{10}$/.test(formData.mobile))
      newErrors.mobile = "A valid 10-digit mobile number is required.";
    if (!formData.purpose_id.trim())
      newErrors.purpose_id = "Please select the purpose of your inquiry.";
    if (!formData.message.trim())
      newErrors.message = "Message cannot be empty.";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile") {
      const sanitizedValue = value.replace(/\D/g, ""); // Remove non-numeric characters
      if (sanitizedValue.length <= 10) {
        setFormData({ ...formData, [name]: sanitizedValue });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCCChange = (e) => {
    const value = e.target.value;
  
    // Ensure the value starts with a '+' and contains only digits
    if (value === "+" || /^\+\d*$/.test(value)) {
      setFormData((prevData) => ({
        ...prevData,
        countryCode: value || "+91", // Ensure default value is set if empty
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});

      try {
        const response = await axios.post(
          `${ip}/moox_events/api/enquiry/add-enquiry`,
          {
            name: formData.name,
            mobileno: `${formData.countryCode} ${formData.mobile}`, // Updated to include country code
            email: formData.email,
            purpose_id: formData.purpose_id,
            purpose_name: formData.purpose_name,
            message: formData.message,
          }
        );

        if (response.status === 201) {
          setSuccessMessage("Your inquiry has been successfully submitted!");
          setFormData({
            name: "",
            email: "",
            mobile: "",
            countryCode: "+91", // Reset country code to default
            purpose_id: "",
            purpose_name: "",
            message: "",
          });
          setTimeout(() => {
            navigate("/services");
          }, 1500);
        }
      } catch (error) {
        console.error("Error submitting inquiry:", error);
      }
    }
  };

  return (
    <>
      {showLoader && (
        <div
          className={`fixed w-full h-screen flex justify-center items-center bg-black z-[999] transition-opacity duration-1000 ${
            isLoading ? "opacity-100" : "opacity-0"
          }`}
        >
          <Loader />
        </div>
      )}
      <Menu />
      <div className="min-h-screen flex flex-col font-parkin bg-gray-100">
        {/* Header Section with Service Details */}
        <div
          className="bg-gray-900 text-white py-16 flex flex-col items-center justify-center px-4"
          data-aos="fade-down"
          data-aos-duration="1500"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white font-parkin mb-8">
            Inquiry for {serviceData ? serviceData.title : "Inquiry"}
          </h1>

          {serviceData && (
            <div className="max-w-4xl w-full p-6 rounded-lg backdrop-blur-sm">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2">
                  <img
                    src={serviceData.image}
                    alt={serviceData.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                <div className="md:w-1/2">
                  <p className="text-lg">
                    {serviceData.status.split(":").map((point, index) => (
                      <li key={index}>{point.trim()}</li>
                    ))}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Breadcrumbs */}
        <nav
          className="bg-[#DBAF76] py-3 px-4 md:py-4 md:px-6"
          data-aos="fade-down"
          data-aos-duration="1500"
        >
          <ol className="flex flex-wrap space-x-2 md:space-x-4 text-sm md:text-base text-white">
            <li>
              <a href="/" className="hover:text-[#785322]">
                Home
              </a>
            </li>
            <li>/</li>
            <li>
              <a href="/services" className="hover:text-[#785322]">
                Service
              </a>
            </li>
            <li>/</li>
            <li>
              <a href="/inquiry" className="hover:text-[#785322]">
                Inquiry
              </a>
            </li>
          </ol>
        </nav>

        {/* Inquiry Form Section */}
        <section
          className="px-4 py-8 md:px-6 md:py-12"
          data-aos="fade-up"
          data-aos-duration="1500"
        >
          <div className="max-w-4xl mx-auto bg-white shadow-lg p-6 md:p-8 rounded-lg">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#283B5C] mb-4 md:mb-6">
              Make an Inquiry
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div className="flex flex-col md:flex-row md:space-x-4">
                <div className="w-full">
                  <label
                    htmlFor="name"
                    className="block text-base md:text-lg font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#DBAF76]"
                    placeholder="Your Name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div className="w-full mt-4 md:mt-0">
                  <label
                    htmlFor="email"
                    className="block text-base md:text-lg font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#DBAF76]"
                    placeholder="Your Email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:space-x-4">
                <div className="w-full">
                  <label
                    htmlFor="mobile"
                    className="block text-base md:text-lg font-medium text-gray-700"
                  >
                    Mobile Number
                  </label>
                  <div className="flex gap-0.5">
                    {/* Country Code Input */}
                    <input
                      type="text"
                      id="countryCode"
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleCCChange}
                      className="px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#DBAF76] w-[100px]"
                      maxLength={5}
                      placeholder="+"
                      pattern="\+\d*"
                      title="Please enter a valid country code (e.g., +91)"
                    />

                    {/* Mobile Number Input */}
                    <input
                      id="mobile"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#DBAF76]"
                      placeholder="Your Mobile Number"
                    />
                  </div>
                  {errors.mobile && (
                    <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
                  )}
                </div>

                <div className="w-full mt-4 md:mt-0">
                  <label
                    htmlFor="purpose"
                    className="block text-base md:text-lg font-medium text-gray-700"
                  >
                    Purpose
                  </label>
                  <select
                    id="purpose"
                    name="purpose_id"
                    value={formData.purpose_id}
                    onChange={(e) => {
                      const selectedPurpose = purposes.find(
                        (purpose) => purpose.purpose_id === e.target.value
                      );
                      setFormData({
                        ...formData,
                        purpose_id: e.target.value,
                        purpose_name: selectedPurpose
                          ? selectedPurpose.purpose_name
                          : "",
                      });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#DBAF76]"
                  >
                    <option value="">Select Purpose</option>
                    {purposes.map((purpose) => (
                      <option
                        key={purpose.purpose_id}
                        value={purpose.purpose_id}
                      >
                        {purpose.purpose_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-base md:text-lg font-medium text-gray-700"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#DBAF76]"
                  placeholder="Your Message"
                ></textarea>
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full py-3 px-6 bg-[#283B5C] text-white font-semibold transition duration-500 rounded-md hover:bg-[#DBAF76] focus:outline-none focus:ring-2 focus:ring-[#DBAF76]"
                >
                  Submit Inquiry
                </button>
              </div>
            </form>

            {successMessage && (
              <p className="mt-4 text-green-600 font-semibold">
                {successMessage}
              </p>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Inquiry;