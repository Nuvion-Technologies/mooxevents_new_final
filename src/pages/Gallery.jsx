import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Menu from '../components/Menu';
import AOS from 'aos';
import Loader from '../components/Loader';
import GalleryPage from '../components/GalleryPage'

const Gallery = () => {
  const [isLoading, setIsLoading] = useState(true); // To handle the loader visibility
  const [showLoader, setShowLoader] = useState(true); // To control the loader visibility on the screen

  // Callback to handle data loaded state
  const handleDataLoaded = () => {
    setIsLoading(false); // Set loading to false after data is loaded
    setTimeout(() => setShowLoader(false), 1000); // Hide the loader with a transition
  };

  useEffect(() => {
    AOS.init({ duration: 1000, once: true }); // Initialize AOS for animations
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
          <h1 className="text-4xl md:text-5xl font-bold text-white font-parkin">Gallery</h1>
          <p className="text-lg md:text-xl mt-2 opacity-0 animate-fadeIn">Amazing moments captured to remember</p>
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
              <a href="/gallery" className="hover:text-[#785322]">
                Gallery
              </a>
            </li>
          </ol>
        </nav>

        {/* Pass handleDataLoaded as a prop to GalleryHome */}
        <GalleryPage onGalleryLoadComplete={handleDataLoaded} />

        {/* Footer Component */}
        <Footer />
      </div>
    </>
  );
};

export default Gallery;
