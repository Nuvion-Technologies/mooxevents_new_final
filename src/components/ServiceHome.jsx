import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ServiceHome = ({ category }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  const ip = import.meta.env.VITE_IP;

  useEffect(() => {
    const fetchServicesData = async () => {
      try {
        const response = await axios.get(
          `${ip}/moox_events/api/service/services`
        );
        const data = response.data;

        if (data.events) {
          setServices(data.events);
        }
      } catch (error) {
        console.error("Error fetching service data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServicesData();
  }, [ip]);

  useEffect(() => {
    const handleScroll = () => {
      const servicesSection = document.getElementById("services-section");
      if (servicesSection) {
        const rect = servicesSection.getBoundingClientRect();
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
          setIsVisible(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleEnquire = (service) => {
    navigate("/inquiry", { state: { service } });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#DBAF76]"></div>
      </div>
    );
  }

  return (
    <div
      id="services-section"
      className="flex items-center justify-center w-full p-4 lg:p-8"
    >
      <div
        className={`w-full lg:w-[80%] transition-opacity duration-1000 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 lg:gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-lg p-4 transition-all duration-500 hover:scale-105 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="flex flex-col h-full">
                <div className="lg:h-64 w-full h-40 mb-4 overflow-hidden rounded-lg">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  {service.title}
                </h4>
                <p className="text-sm text-gray-600 mb-4 flex-grow">
                  {service.status.split(":")[0].trim()}
                </p>
                <button
                  className="font-bold bg-[#DBAF76] text-white border-none py-2 px-2 lg:py-2 lg:px-4 rounded-lg hover:bg-[#e1a453] hover:text-white transition-all duration-300 flex items-center justify-center gap-2 "
                  onClick={() => handleEnquire(service)}
                >
                  <span className="text-sm lg:text-base">INQUIRY NOW</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceHome;
