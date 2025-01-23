import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Menu from "../components/Menu";
import AOS from "aos";
import Loader from "../components/Loader";
import Blogs from "../components/Blogs";

const Events = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);

  const handleDataLoaded = () => {
    setIsLoading(false);
    setTimeout(() => setShowLoader(false), 1000);
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-out",
      mirror: true,
    });

    const timer = setTimeout(() => {
      if (isLoading) {
        handleDataLoaded();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isLoading]);

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
        <div
          className="bg-gray-900 h-96 text-white text-center py-16 flex items-center justify-center flex-col px-4"
          data-aos="fade-down"
          data-aos-duration="1500"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white font-parkin">
            Memories we made
          </h1>
          <p className="text-lg md:text-xl mt-2 opacity-0 animate-fadeIn">
            Crafted amazing memories using our extraordinary skills.
          </p>
        </div>

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
              <a href="/events" className="hover:text-[#785322]">
                Blogs
              </a>
            </li>
          </ol>
        </nav>

        <Blogs onDataLoaded={handleDataLoaded} />
        
        <Footer />
      </div>
    </>
  );
};

export default Events;