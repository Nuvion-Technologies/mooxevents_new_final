import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Menu from "../components/Menu";
import AOS from "aos";
import "aos/dist/aos.css";
import Loader from "../components/Loader";

const ContactUs = () => {
  const ip = import.meta.env.VITE_IP;
  const [isLoading, setIsLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    purpose: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => setShowLoader(false), 1000);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full Name is required.";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "A valid email is required.";
    if (!formData.mobile.trim() || !/^\d{10}$/.test(formData.mobile))
      newErrors.mobile = "A valid 10-digit mobile number is required.";
    if (!formData.purpose.trim()) newErrors.purpose = "Purpose is required.";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // For mobile, restrict non-numeric input
    if (name === "mobile") {
      const sanitizedValue = value.replace(/\D/g, ""); // Remove non-digit characters
      setFormData({ ...formData, [name]: sanitizedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Remove error dynamically when the field is corrected
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
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
  
  // Initialize formData with a default countryCode
  useEffect(() => {
    if (!formData.countryCode) {
      setFormData((prevData) => ({
        ...prevData,
        countryCode: "+91",
      }));
    }
  }, [formData]);  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});

      // API endpoint for form submission
      const apiUrl = `${ip}/moox_events/api/contactus/add-queries`;

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            mobileno: `${formData.countryCode} ${formData.mobile}`,
            purpose: formData.purpose,
          }),
        });

        if (response.ok) {
          // Successful submission, show success popup and reset form
          setSuccessMessage(true);
          setTimeout(() => {
            window.location.reload(); // Reload page after success
          }, 2000); // Wait for the popup to appear
        } else {
          console.error("Error:", response.statusText);
          alert(
            "There was an issue with submitting your message. Please try again later."
          );
        }
      } catch (error) {
        console.error("Error:", error);
        alert(
          "There was an issue with submitting your message. Please try again later."
        );
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
        {/* Header Section */}
        <div
          className="bg-gray-900 h-96 text-white text-center py-16 flex items-center justify-center flex-col px-4"
          data-aos="fade-down"
          data-aos-duration="1500"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white font-parkin">
            Contact Us
          </h1>
          <p className="text-lg md:text-xl mt-2 opacity-0 animate-fadeIn">
            We'd love to hear from you
          </p>
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
              <a href="/contact-us" className="hover:text-[#785322]">
                Contact Us
              </a>
            </li>
          </ol>
        </nav>

        {/* Contact Form Section */}
        <section
          className="px-4 py-8 md:px-6 md:py-12"
          data-aos="fade-up"
          data-aos-duration="1500"
        >
          <div className="max-w-4xl mx-auto bg-white shadow-lg p-6 md:p-8 rounded-lg">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#283B5C] mb-4 md:mb-6">
              Get in Touch
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div className="flex flex-col md:flex-row md:space-x-4">
                {/* Name */}
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

                {/* Email */}
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
                {/* Mobile */}
                {/* Mobile with Country Code */}
                <div className="w-full">
                  <label
                    htmlFor="mobile"
                    className="block text-base md:text-lg font-medium text-gray-700"
                  >
                    Mobile Number
                  </label>
                  <div className="flex gap-0.5">
                    {/* Country Code Dropdown */}
                    <input
                      type="text"
                      id="countryCode"
                      name="countryCode"
                      value={formData.countryCode || "+91"} // Default to '+91'
                      onChange={handleCCChange} // Updated function
                      className="px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#DBAF76] w-[100px]"
                      maxLength={5} // Limit the input to a reasonable length for country codes
                      placeholder="+"
                      pattern="\+\d*" // Only allow the '+' sign followed by numbers
                      title="Please enter a valid country code (e.g., +91)"
                    />

                    {/* Mobile Number Input */}
                    <input
                      id="mobile"
                      name="mobile"
                      value={formData.mobile}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                        if (value.length <= 10) {
                          handleChange({ target: { name: "mobile", value } }); // Update formData with sanitized value
                        }
                      }}
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#DBAF76]"
                      placeholder="Your Mobile Number"
                    />
                  </div>
                  {errors.mobile && (
                    <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
                  )}
                </div>

                {/* Purpose */}
                <div className="w-full mt-4 md:mt-0">
                  <label
                    htmlFor="purpose"
                    className="block text-base md:text-lg font-medium text-gray-700"
                  >
                    Purpose
                  </label>
                  <input
                    id="purpose"
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#DBAF76]"
                    placeholder="Purpose of Inquiry"
                  />
                  {errors.purpose && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.purpose}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full py-3 px-6 bg-[#283B5C] text-white font-semibold transition duration-500 rounded-md hover:bg-[#DBAF76] focus:outline-none focus:ring-2 focus:ring-[#DBAF76]"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Locate Us Section */}
        <section
          className="py-8 px-4 md:py-12 flex items-center justify-center rounded-lg"
          data-aos="fade-up"
          data-aos-duration="1500"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6">
              Locate Us
            </h2>
            <p className="text-base md:text-lg mb-4">
              Find our office on the map below:
            </p>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3691.466667990506!2d70.759937!3d22.298184!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3959cbd12b824207%3A0xb6a12ff15c98dc9c!2sMoox%20Events%20Pvt.%20Ltd.%C2%AE!5e0!3m2!1sen!2sin!4v1733050287618!5m2!1sen!2sin"
              width="100%"
              height="300"
              className="rounded-lg shadow-2xl md:w-[900px] md:h-[450px]"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </section>

        {/* Footer Component */}
        <Footer />

        {/* Custom Success Notification */}
        {successMessage && (
          <div className="fixed bottom-10 right-10 bg-green-500 text-white p-4 rounded-lg shadow-lg">
            <p>Your message has been sent successfully!</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ContactUs;
