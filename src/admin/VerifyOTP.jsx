import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import CryptoJS from "crypto-js";
import { KeyRound, ArrowRight, Mail } from "lucide-react";

const ENCRYPTION_KEY =
  "a76e9f32c4a0a9e7r8y5g6r4e8f9g6dgb271f51aa9785d29a3b1d4a76e9f32c4a7f400f6c1820a97856b7f400fef12ab08c7f630ec15b3d866a148634b43dfe3dc1820a978564e896db2";

const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
};

const decryptData = (encryptedData) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

const VerifyOTP = () => {
  const ip = import.meta.env.VITE_IP;
  const [otpData, setOtpData] = useState({
    email: localStorage.getItem("emailid"),
    otp: "",
    recaptchaToken: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setOtpData({
      ...otpData,
      [e.target.name]: e.target.value,
    });
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const encryptedData = encryptData(otpData);
      const response = await axios.post(
        `${ip}/moox_events/api/auth/verify-otp`,
        { encryptedData }
      );

      const decryptedResponse = decryptData(response.data.encryptedData);
      setSuccessMessage(decryptedResponse.message);

      if (decryptedResponse.message === "Login successful") {
        localStorage.clear();
        localStorage.setItem("token", decryptedResponse.token);
        localStorage.setItem("userid", decryptedResponse.id);
        localStorage.setItem("emailid", decryptedResponse.email);
        localStorage.setItem("mobileno", decryptedResponse.mobile);
        localStorage.setItem("name", decryptedResponse.name);
        window.location.href = "/admin";
      } else {
        window.location.reload();
      }
    } catch (error) {
      const decryptedErrorMessage = error.response?.data?.encryptedData
        ? decryptData(error.response.data.encryptedData).message
        : "OTP verification error";
      setErrorMessage(decryptedErrorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecaptchaChange = (token) => {
    setOtpData({ ...otpData, recaptchaToken: token });
  };

  return (
    <div className="min-h-screen bg-[#FDF8DA] relative flex items-center justify-center p-4">
      {/* Logo */}
      <div className="absolute top-6 justify-center sm:top-8 sm:left-8">
        <img
          src="/logo.png"
          alt="Moox Events Logo"
          className="h-24 sm:h-24 w-auto transform hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#d6af53]/20">
          {/* Header Section */}
          <div className="px-8 pt-8 pb-6 bg-gradient-to-br from-[#1a2a47] via-[#1a2a47] to-[#1a1a1a] text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[#d6af53]/10"></div>
            <div className="relative">
              <h2 className="text-3xl font-bold text-center mb-2">
                Verify Your Email
              </h2>
              <p className="text-[#d6af53] text-center font-medium">
                Enter the OTP sent to your email
              </p>
            </div>
          </div>

          <div className="p-8">
            {/* Email Display */}
            <div className="mb-6 flex items-center justify-center gap-2 text-[#1a2a47] bg-[#FDF8DA] p-4 rounded-lg border border-[#d6af53]/30">
              <Mail className="h-5 w-5 text-[#d6af53]" />
              <span className="text-sm font-medium">{otpData.email}</span>
            </div>

            <form onSubmit={handleVerify} className="space-y-6">
              <div className="relative">
                <label
                  htmlFor="otp"
                  className="text-sm font-medium text-[#1a2a47] block mb-2"
                >
                  One-Time Password (OTP)
                </label>
                <div className="relative group">
                  <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1a2a47]/40 group-hover:text-[#d6af53] transition-colors duration-200 h-5 w-5" />
                  <input
                    type="text"
                    name="otp"
                    id="otp"
                    value={otpData.otp}
                    onChange={handleChange}
                    onInput={(e) => {
                      // Only allow numeric values
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                    }}
                    required
                    maxLength={6}
                    className="pl-10 w-full px-4 py-3 border border-[#d6af53]/30 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200 bg-white/50 hover:bg-white"
                    placeholder="Enter 6-digit OTP"
                  />
                </div>
              </div>

              <div className="flex justify-center transform scale-90 sm:scale-100">
                <ReCAPTCHA
                  sitekey="6LfI7GoqAAAAANuq_7HftjCv1BumXG-61PS7h5Mh"
                  onChange={handleRecaptchaChange}
                />
              </div>

              <button
                type="submit"
                disabled={!otpData.recaptchaToken || isLoading}
                className="w-full bg-[#1a2a47] text-white py-3.5 px-4 rounded-lg font-semibold hover:bg-[#d6af53] focus:outline-none focus:ring-2 focus:ring-[#d6af53] focus:ring-offset-2 transform transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Verify OTP
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {errorMessage && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center animate-fade-in">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm text-center animate-fade-in">
                {successMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
