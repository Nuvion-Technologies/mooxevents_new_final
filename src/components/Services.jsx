import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Service.css";
import axios from "axios";

const Services = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const ip = import.meta.env.VITE_IP;
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const servicesSection = document.getElementById("services-section");
      const cardSection = document.getElementById("card-section");

      if (servicesSection) {
        const rect = servicesSection.getBoundingClientRect();
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
          setIsVisible(true);
        }
      }

      if (cardSection) {
        const rect = cardSection.getBoundingClientRect();
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
          setCardVisible(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchServicesData = async () => {
      try {
        const response = await axios.get(
          `${ip}/moox_events/api/service/services`
        );
        const data = response.data;

        if (data.events) {
          setServices(data.events);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching service data:", error);
        setLoading(false);
      }
    };

    fetchServicesData();
  }, [ip]);

  const handleInquireClick = (service) => {
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
      className="py-20 px-6 flex w-full items-center justify-center flex-col min-h-[1000px]"
    >
      <div className="flex w-[90%] items-start justify-between flex-col md:flex-row h-full">
        {/* Mobile Heading (visible only on mobile/tablet) */}
        <h2 className="md:hidden text-3xl font-semibold text-moox-navy mb-8 w-full text-center">
          Our Services
        </h2>

        {/* Left Letters (hidden on mobile) */}
        <div className="hidden md:flex w-[150px] h-auto items-start">
          <div className="w-full gap-3 flex flex-col">
            {"SERVICES".split("").map((letter, index) => (
              <div
                key={index}
                className={`w-full flex items-start ml-12 justify-start text-7xl font-bold text-moox-gold opacity-90 animate__animated animate__fadeIn animate__delay-${
                  index + 1
                }s`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {letter}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-col items-center justify-between w-full md:w-[90%] h-full">
          <div className="w-full md:w-[90%]">
            <p className="md:text-lg text-justify text-moox-navy mb-12 w-full text-md">
              Our trained and skilled event planners have the right expertise to
              make your event more spectacular. With full-time experience in the
              event management & Wedding Planning industry, we are serving our
              customers with the best possible services delivered at the best
              possible rates.
            </p>
          </div>

          {/* Cards Section */}
          <div
            id="card-section"
            className="w-full md:w-[90%] h-full grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8"
          >
            {services.map((service, index) => (
              <div
                className={`flip-card-container transform transition-all duration-700 ease-out ${
                  cardVisible
                    ? `translate-y-0 opacity-100`
                    : "translate-y-10 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 500}ms` }}
                key={service.id}
              >
                <div className="flip-card shadow-2xl">
                  {/* Front Side */}
                  <div className="flip-card-front">
                    <div className="absolute inset-0 bg-black opacity-30 z-0"></div>
                    <img
                      src={service.image}
                      alt={service.title}
                      className="card-image"
                    />
                    <div className="card-text text-lg md:text-2xl">
                      {service.title}
                    </div>
                  </div>

                  {/* Back Side */}
                  <div className="flip-card-back flex flex-col items-center justify-center p-4">
                    <h3 className="card-back-title text-base md:text-7xl mb-2">
                      {service.title}
                    </h3>
                    <p className="card-back-status text-sm md:text-base mb-4">
                      {service.status.split(":")[0].trim()}
                    </p>

                    <button
                      className="font-bold bg-[#DBAF76] text-white border-none py-2 px-2 lg:py-2 lg:px-4 rounded-lg hover:bg-[#e1a453] hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                      onClick={() => handleInquireClick(service)}
                    >
                      <span className="text-sm lg:text-base">INQUIRE NOW</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 sm:h-4 sm:w-4"
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
