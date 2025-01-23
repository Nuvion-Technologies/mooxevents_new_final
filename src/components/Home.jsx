import { useState, useEffect } from "react";
import Menu from "./Menu";
import Loader from "./Loader";
import "./animation.css";
import Footer from "./Footer";
import EventHome from "./EventHome";
import { photos } from "./Photos";
import GalleryHome from "./GalleryHome";
import ServiceHome from "./ServiceHome";
import HomeSlider from "./HomeSlider";
import AchivHome from "./AchivHome";
import TeamHome from "./TeamHome";
import ClientHome from "./ClientHome";
import About from "./About";
import Services from "./Services";
import Blogs from "./BlogsHome";
import AOS from "aos";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);

  const handleDataLoaded = () => {
    setIsLoading(false); // Set loading to false once data is fetched
    setTimeout(() => setShowLoader(false), 1000); // Hide loader after 1 second transition
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => setShowLoader(false), 1000);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
      AOS.init({
        duration: 1000,
        once: true,
        easing: "ease-out",
        mirror: true,
      });
    }, []);

  const [headingInView, setHeadingInView] = useState(false);
  const [descriptionInView, setDescriptionInView] = useState(false);
  const [servicesInView, setServicesInView] = useState(false); // For "Our Services" section
  const [achivInView, setAchivInView] = useState(false); // For "Our Services" section
  const [teamInView, setTeamInView] = useState(false);
  const [eventInView, setEventInView] = useState(false);
  const [clientInView, setClientInView] = useState(false);
  const [galleryInView, setGalleryInView] = useState(false);

  // Intersection Observer to trigger the animations when in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.id === "about-heading") {
              setHeadingInView(true);
            } else if (entry.target.id === "about-description") {
              setDescriptionInView(true);
            } else if (entry.target.id === "services-heading") {
              setServicesInView(true); // Trigger animation for Our Services
            } else if (entry.target.id === "achiv-heading") {
              setAchivInView(true); // Trigger animation for Our Services
            } else if (entry.target.id === "team-heading") {
              setTeamInView(true);
            } else if (entry.target.id === "event-heading") {
              setEventInView(true);
            } else if (entry.target.id === "client-heading") {
              setClientInView(true);
            } else if (entry.target.id === "gallery-heading") {
              setGalleryInView(true);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    const headingElement = document.querySelector("#about-heading");
    const descriptionElement = document.querySelector("#about-description");
    const servicesHeadingElement = document.querySelector("#services-heading"); // Our Services heading
    const achivHeadingElement = document.querySelector("#achiv-heading"); // Our Services heading
    const teamHeadingElement = document.querySelector("#team-heading"); // Our Team heading
    const eventHeadingElement = document.querySelector("#event-heading"); // Our Team heading
    const clientHeadingElement = document.querySelector("#client-heading"); // Our Team heading
    const galleryHeadingElement = document.querySelector("#gallery-heading"); // Our Team heading

    if (headingElement) observer.observe(headingElement);
    if (descriptionElement) observer.observe(descriptionElement);
    if (servicesHeadingElement) observer.observe(servicesHeadingElement);
    if (achivHeadingElement) observer.observe(achivHeadingElement);
    if (teamHeadingElement) observer.observe(teamHeadingElement);
    if (eventHeadingElement) observer.observe(eventHeadingElement);
    if (clientHeadingElement) observer.observe(clientHeadingElement);
    if (galleryHeadingElement) observer.observe(galleryHeadingElement);

    return () => observer.disconnect();
  }, []);

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

      <div
        className={`w-full flex justify-center items-center flex-col font-parkin transition-opacity duration-1000 ${
          !isLoading ? "opacity-100" : "opacity-0"
        }`}
        style={{
          backgroundImage: `
      radial-gradient(circle at 30% 30%, rgba(255, 215, 0, 0.2), transparent 60%),
      radial-gradient(circle at 70% 80%, rgba(70, 130, 180, 0.3), transparent 70%)
    `,
          backgroundSize: "cover", // Adjust to fill the section smoothly
          backgroundAttachment: "scroll", // Ensures it moves with the section
          backgroundBlendMode: "overlay", // Ensures smooth blending with content
        }}
      >

        <HomeSlider />

        {/* ABOUT US SECTION */}
        <About />

        {/* OUR SERVICES SECTION */}
        <Services />

        {/* GALLERY */}
        <div className="w-full py-16">
          <div className="text-center w-full max-w-3xl mx-auto">
            <div
              id="gallery-heading"
              className={`text-4xl md:text-6xl font-bold text-gray-800 transform transition-all duration-1000 ${
                galleryInView ? "animate-slideInFromLeft" : "opacity-0"
              }`}
            >
              EVENTS
            </div>

            <div
              className={`mt-4 w-10 md:w-20 mx-auto h-1 bg-gray-500 transform transition-all duration-1000 ${
                galleryInView ? "animate-widthExpand" : "opacity-0"
              }`}
            ></div>
          </div>
          <GalleryHome />
        </div>

        {/* EVENT HOME SECTION  */}
        <div className="w-full py-16">
          <div className="text-center w-full max-w-3xl mx-auto">
            <div
              id="event-heading"
              className={`text-4xl md:text-6xl font-bold text-gray-800 transform transition-all duration-1000 ${
                eventInView ? "animate-slideInFromLeft" : "opacity-0"
              }`}
            >
              BLOGS
            </div>
            <div
              className={`mt-4 w-10 md:w-20 mx-auto h-1 bg-gray-500 transform transition-all duration-1000 ${
                eventInView ? "animate-widthExpand" : "opacity-0"
              }`}
            ></div>
          </div>
          {/* <EventHome /> */}
          <br/>
          <Blogs />
        </div>

        {/* OUR ACHIVMENTS SECTION */}
        <div className="w-full py-16">
          <div className="text-center w-full max-w-3xl mx-auto">
            {/* Our Services Heading */}
            <div
              id="achiv-heading"
              className={`text-4xl md:text-6xl font-bold text-gray-800 transform transition-all duration-1000 ${
                achivInView ? "animate-slideInFromLeft" : "opacity-0"
              }`}
            >
              MOMENTS & JOURNEY
            </div>

            {/* Horizontal line animation */}
            <div
              className={`mt-4 w-10 md:w-20 mx-auto h-1 bg-gray-500 transform transition-all duration-1000 ${
                achivInView ? "animate-widthExpand" : "opacity-0"
              }`}
            ></div>
          </div>
          <AchivHome />
        </div>

        {/* OUR CLIENTS  */}
        <div className="w-full py-16">
          <div className="text-center w-full max-w-3xl mx-auto">
            {/* Our Services Heading */}
            <div
              id="client-heading"
              className={`text-4xl md:text-6xl font-bold text-gray-800 transform transition-all duration-1000 ${
                clientInView ? "animate-slideInFromLeft" : "opacity-0"
              }`}
            >
              OUR VALUED CLIENTS
            </div>

            {/* Horizontal line animation */}
            <div
              className={`mt-4 w-10 md:w-20 mx-auto h-1 bg-gray-500 transform transition-all duration-1000 ${
                clientInView ? "animate-widthExpand" : "opacity-0"
              }`}
            ></div>
          </div>
          <ClientHome onDataLoaded={handleDataLoaded} />{" "}
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Home;
