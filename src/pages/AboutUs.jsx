import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Menu from "../components/Menu";
import AOS from "aos";
import "aos/dist/aos.css";
import Loader from "../components/Loader";
import ClientHome from "../components/ClientHome";
import TeamHome from "../components/TeamHome";
import VisionMission from "../components/VisionMission";

const AboutUs = () => {
  const [isLoading, setIsLoading] = useState(true); // Track if data is still loading
  const [showLoader, setShowLoader] = useState(true); // Control visibility of loader

  // Handle data loaded notification from ClientHome
  const handleDataLoaded = () => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => setShowLoader(false), 1000);
    }, 1000);

    return () => clearTimeout(timeout);
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });
  }, []);

  return (
    <>
      {showLoader && (
        <div
          className={`fixed w-full h-screen flex justify-center items-center bg-black z-[999] transition-opacity duration-1000 ${
            isLoading ? 'opacity-100' : 'opacity-0'
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
          data-aos-duration="2000"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white font-parkin">
            About Us
          </h1>
          <p className="text-lg md:text-xl mt-2 opacity-0 animate-fadeIn">
            Dedicated to innovation, quality, and customer satisfaction.
          </p>
        </div>
        {/* Breadcrumbs */}
        <nav className="bg-[#DBAF76] py-3 px-4 md:py-4 md:px-6">
          <ol className="flex flex-wrap space-x-2 md:space-x-4 text-sm md:text-base text-white">
            <li>
              <a href="/" className="hover:text-[#785322]">
                Home
              </a>
            </li>
            <li>/</li>
            <li>
              <a href="/about" className="hover:text-[#785322]">
                About Us
              </a>
            </li>
          </ol>
        </nav>
        {/* Description Section */}
        <div className="w-full h-auto flex items-center justify-center py-16" data-aos="fade-down" data-aos-duration="3000">
          <div className="text-center w-full max-w-3xl">
            <div
              className="w-[80%] md:w-auto text-lg text-gray-700 mx-auto leading-relaxed"
            >
              <p className="mb-4">
                Moox Events Pvt. Ltd. is a Rajkot, Gujarat-based event
                management & wedding planning company dedicated to providing
                customers with a wide assortment of event management services
                for all sorts of corporate and personal events.
              </p>
              <p>
                Our trained and skilled event planners have the right expertise
                to make your event more spectacular with full-time experience in
                the event management & Wedding Planning industry.
              </p>
            </div>
          </div>
        </div>
        {/* Vision & Mission Section */}
        <VisionMission />
        {/* ClientHome Component */}
        <div
          className="text-center text-gray-900 font-parkin text-5xl font-bold pt-16"
          data-aos="fade-up" // Fade-up animation for the heading
          data-aos-duration="1000" // Duration for the heading animation
          data-aos-delay="200" // Slight delay for the heading animation
        >
          OUR CLIENTS
        <div
          className={`mt-4 w-80 mx-auto h-1 bg-gray-500 transform transition-all duration-1000`}
          data-aos="zoom-in" // Zoom-in animation for the underline
          data-aos-duration="1000" // Duration for the underline animation
          data-aos-delay="400" // Delay for the underline animation (after heading)
        ></div>
        <ClientHome onDataLoaded={handleDataLoaded} />{" "}
        {/* Pass handleDataLoaded prop */}
        {/* Footer Component */}
        </div>
        
        {/* OUT TEAM  */}
        <div className="bg-white w-full pt-16">
          <div className="text-center w-full max-w-3xl mx-auto">
            {/* Our Services Heading */}
            <div
              id="team-heading"
              className={`text-4xl md:text-6xl font-bold text-gray-800 transform transition-all duration-1000`}
            >
              MEET THE TEAM
            </div>

            {/* Horizontal line animation */}
            <div
              className={`mt-4 w-80  mx-auto h-1 bg-gray-500 transform transition-all duration-1000 `}
            ></div>
          </div>
          <TeamHome />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default AboutUs;
