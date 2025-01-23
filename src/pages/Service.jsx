import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Menu from '../components/Menu';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Loader from '../components/Loader';
import ServiceHome from '../components/ServiceHome';
import Inquiry from './Inquiry';

const Service = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  
  // Define a variable to pass to ServiceHome (e.g., a service category or other data)
  const serviceCategory = "Wedding Planning"; // Example variable to pass down

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
          <h1 className="text-4xl md:text-5xl font-bold text-white font-parkin">Our Services</h1>
          <p className="text-lg md:text-xl mt-2 opacity-0 animate-fadeIn">Best tailored solution for your next event.</p>
        </div>

        {/* Breadcrumbs */}
        <nav className="bg-[#DBAF76] py-3 px-4 md:py-4 md:px-6" data-aos="fade-down" data-aos-duration="2000">
          <ol className="flex flex-wrap space-x-2 md:space-x-4 text-sm md:text-base text-white">
            <li>
              <a href="/" className="hover:text-[#785322]">
                Home
              </a>
            </li>
            <li>/</li>
            <li>
              <a href="/contact-us" className="hover:text-[#785322]">
                Services
              </a>
            </li>
          </ol>
        </nav>

        {/* Service Description */}
        <div className='py-10' data-aos="fade-up" data-aos-duration="3000">
          <div className="flex flex-col font-parkin items-center justify-center text-center px-6 bg-gray-100 max-w-4xl mx-auto">
            <p className="md:text-lg text-justify text-moox-navy mb-12 w-full text-md">
              Our trained and skilled event planners have the right expertise to make your event more spectacular. With full-time experience in the event management & Wedding Planning industry, we are serving our customers with the best possible services delivered at the best possible rates.
            </p>
          </div>

          {/* Pass serviceCategory to ServiceHome */}
          <ServiceHome category={serviceCategory} />
        </div>

        {/* Footer Component */}
        <Footer />
      </div>
    </>
  );
};

export default Service;
