import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa"; // Social media icons

const Footer = () => {
  return (
    <div className="w-full h-auto flex items-center justify-center bg-gray-800">
      <footer className="bg-gray-800 text-white py-12 w-full md:w-[70%]">
        {/* Top Footer Section */}
        <div className="mx-auto flex flex-col md:flex-row w-full items-center md:items-start justify-between">
          <div className="mb-8 md:w-2/3 text-center md:text-left">
            <h2 className="text-4xl w-full md:text-7xl text-center md:text-left font-bold text-gray-100">Moox Events <br /> Pvt. Ltd.</h2>
          </div>
          <div className="w-full md:w-1/3 mt-8 md:mt-0">
            {/* Contact Us Section */}
            <div className="text-gray-400 text-center md:text-left">
              <ul className="flex flex-col items-center md:items-start justify-center gap-3">
                <h3 className="text-2xl font-semibold text-gray-200 mb-4">Contact Us</h3>
                <li className="mb-2">Office No. 609, 6th Floor, Nakshatra-VIII, Opp. Sun City Apartment, Sadhu Vaswani Road, RAJKOT, Gujarat (India) – 360005</li>
                <li className="mb-2">+91 88662 58585 <br />+91 70163 00378 </li>
                <li className="mb-2">
                  <a href="mailto:moox.info@gmail.com">moox.info@gmail.com</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Middle Section (Navigation and Social Links) */}
        <div className="bg-gray-700 py-8 md:rounded-full rounded-lg mt-5">
          <div className="mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center">
            {/* Navigation Links */}
            <div className="flex flex-col md:flex-row gap-8 justify-center mb-6 md:mb-0">
              <ul className="text-gray-300 flex flex-col md:flex-row items-center justify-center gap-4">
                <li className="mb-2 md:mb-0">
                  <a href="/" className="hover:text-gray-400 transition duration-300">Home</a>
                </li>
                <li className="mb-2 md:mb-0">
                  <a href="/about" className="hover:text-gray-400 transition duration-300">About Us</a>
                </li>
                <li className="mb-2 md:mb-0">
                  <a href="/services" className="hover:text-gray-400 transition duration-300">Services</a>
                </li>
                <li className="mb-2 md:mb-0">
                  <a href="/contact" className="hover:text-gray-400 transition duration-300">Contact</a>
                </li>
              </ul>
            </div>

            {/* Social Media Links */}
            <div className="flex gap-6 justify-center mb-6 md:mb-0">
              <a href="https://www.facebook.com/mooxevents/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transform transition-all duration-300">
                <FaFacebook size={24} />
              </a>
              <a href="https://www.instagram.com/mooxevents/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transform transition-all duration-300">
                <FaInstagram size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section (Copyright Information) */}
        <div className="text-center py-4">
          <p className="text-gray-400 text-sm">&copy; 2024 Moox Events Pvt. Ltd. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
