// import React, {useState,useEffect,useRef} from 'react';

// const About = () => {
//   const [isVisible, setIsVisible] = useState(false);
//   const sectionRef = useRef(null);
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setIsVisible(true);
//         }
//       },
//       { threshold: 0.5 }
//     );

//     if (sectionRef.current) {
//       observer.observe(sectionRef.current);
//     }

//     return () => {
//       if (sectionRef.current) {
//         observer.unobserve(sectionRef.current);
//       }
//     };
//   }, []);
//   const useCountUp = (start, end, duration) => {
//     const [count, setCount] = useState(start);

//     useEffect(() => {
//       if (isVisible) {
//         let startTimestamp = null;
//         const step = (timestamp) => {
//           if (!startTimestamp) startTimestamp = timestamp;
//           const progress = Math.min((timestamp - startTimestamp) / duration, 1);
//           setCount(Math.floor(progress * (end - start) + start));
//           if (progress < 1) {
//             window.requestAnimationFrame(step);
//           }
//         };
//         window.requestAnimationFrame(step);
//       }
//     }, [isVisible, start, end, duration]);

//     return count;
//   };

//   // Counting values
//   const clientsCount = useCountUp(0, 45, 2000); // 2 seconds for animation
//   const eventsCount = useCountUp(0, 30, 2000);
//   const categoriesCount = useCountUp(0, 15, 2000);
//   return (
//     <section id="about-us"  ref={sectionRef} className="py-20 px-6 flex w-full items-center justify-center flex-col min-h-[1000px]">

// <div className="flex w-[85%] items-start justify-center flex-row h-full">

//       <div className="flex flex-col items-center justify-between w-[85%] h-full p-3">
//         {/* About Description */}
//         <p className="md:text-lg md:text-center text-justify text-moox-navy mb-12 w-4/5 sm:w-full text-md">
//           Moox Events Pvt. Ltd. is a Rajkot, Gujarat-based event management & wedding planning company dedicated to
//           providing customers with a wide assortment of event management services for all sorts of corporate and
//           personal events. Be it live shows, celebrity events, entertainment events, star nights, product launches,
//           theme parties, wedding events, birthdays, anniversaries, Baby showers, corporate events, meet-up, and many
//           more….
//         </p>

//         {/* Key Highlights Section */}
//         <div className="flex items-center justify-center gap-12 w-5/6 md:w-full flex-col md:flex-row">
//           {/* Card 1: Creative Design */}
//           <div className="h-96 w-full sm:w-4/5 md:w-1/3 justify-between flex flex-col items-center text-center bg-moox-navy text-white p-6 rounded-xl transform hover:scale-105 hover:shadow-lg transition-all duration-300">
//             <div className="w-20 h-20 mb-6 rounded-full border-4 border-moox-gold flex items-center justify-center">
//               <svg
//                 className="w-12 h-12 text-moox-gold"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 13l7-7 7 7"></path>
//               </svg>
//             </div>
//             <h3 className="text-2xl font-semibold mb-3 text-moox-gold">Creative Design</h3>
//             <p className="text-md opacity-90">
//               We turn your ideas intoreality with designs that perfectly reflect your brand and vision.
//             </p>
//           <div className='flex flex-row justify-center items-center mt-4 gap-3'>
//             <span className="text-moox-gold text-4xl">{clientsCount}+</span> clients served.
//             </div>
//           </div>

//           {/* Card 2: Flawless Coordination */}
//           <div className="h-96 w-full sm:w-4/5 md:w-1/3 flex flex-col items-center justify-between text-center bg-moox-navy text-white p-6 rounded-xl transform hover:scale-105 hover:shadow-lg transition-all duration-300">
//             <div className="w-20 h-20 mb-6 rounded-full border-4 border-moox-gold flex items-center justify-center">
//               <svg
//                 className="w-12 h-12 text-moox-gold"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
//               </svg>
//             </div>
//             <h3 className="text-2xl font-semibold mb-3 text-moox-gold">Flawless Coordination</h3>
//             <p className="text-md opacity-90">
//               Our expert coordinators ensure seamless execution, handling everything from A to Z so you don't have to.
//             </p>
//             <div className='flex flex-row justify-center items-center mt-4 gap-3'>
//             <span className="text-moox-gold text-4xl">{eventsCount}+</span> events organized.
//             </div>
//           </div>

//           {/* Card 3: Timely Execution */}
//           <div className="h-96 w-full sm:w-4/5 md:w-1/3 flex flex-col items-center justify-between text-center bg-moox-navy text-white p-6 rounded-xl transform hover:scale-105 hover:shadow-lg transition-all duration-300">
//             <div className="w-20 h-20 mb-6 rounded-full border-4 border-moox-gold flex items-center justify-center">
//               <svg
//                 className="w-12 h-12 text-moox-gold"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
//               </svg>
//             </div>
//             <h3 className="text-2xl font-semibold mb-3 text-moox-gold">Timely Execution</h3>
//             <p className="text-md opacity-90">
//              We prioritize efficiency and punctuality, ensuring your event goes off without a hitch—right on schedule.
//             </p>
//             <div className='flex flex-row justify-center items-center mt-4 gap-3'>
//             <span className="text-moox-gold text-4xl">{categoriesCount}+</span>categories of events.
//             </div>
//           </div>
//         </div>

//         {/* Call to Action */}
//         <div className="mt-12 flex justify-center animate__animated animate__fadeIn animate__delay-4s">
//           <a
//             href="#contact-us"
//             className="px-8 py-3 text-lg font-semibold bg-moox-gold text-moox-navy rounded-full hover:bg-moox-navy hover:text-white transition duration-300 ease-in-out"
//           >
//             Let's Plan Your Event
//           </a>
//         </div>
//       </div>

//       <div className="flex w-[150px] h-auto items-start">
//           <div className="w-full gap-3 flex flex-col">
//             {"ABOUT".split("").map((letter, index) => (
//               <div
//                 key={index}
//                 className={`w-full flex items-end justify-end text-gray-800 text-7xl font-parkin p-3 transform transition-all duration-500 ease-out ${
//                   isVisible
//                     ? `translate-x-0 opacity-100`
//                     : "-translate-x-20 opacity-0"
//                 }`}
//                 style={{
//                   transitionDelay: `${index * 100}ms`, // Add staggered delay for each letter
//                 }}
//               >
//                 {letter}
//               </div>
//             ))}
//           </div>
//         </div>

// </div>

//     </section>
//   );
// };

// export default About;

import React, { useState, useEffect, useRef } from "react";

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const useCountUp = (start, end, duration) => {
    const [count, setCount] = useState(start);

    useEffect(() => {
      if (isVisible) {
        let startTimestamp = null;
        const step = (timestamp) => {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          setCount(Math.floor(progress * (end - start) + start));
          if (progress < 1) {
            window.requestAnimationFrame(step);
          }
        };
        window.requestAnimationFrame(step);
      }
    }, [isVisible, start, end, duration]);

    return count;
  };

  // Counting values
  const clientsCount = useCountUp(0, 45, 2000); // 2 seconds for animation
  const eventsCount = useCountUp(0, 30, 2000);
  const categoriesCount = useCountUp(0, 15, 2000);

  return (
    <section
      id="about-us"
      ref={sectionRef}
      className="py-20 px-6 flex w-full items-center justify-center flex-col min-h-fit"
    >
      <div className="flex w-full flex-col md:flex-row items-start justify-center h-full gap-12">
        {/* Left side: New Heading and description */}
        <div className="flex flex-col items-center justify-between w-full md:w-[60%] p-3">
          {/* New Heading for Mobile & Tablet */}
          <h2 className="md:hidden text-5xl font-semibold text-moox-navy mb-8">
            ABOUT
          </h2>

          <p className="md:text-lg text-justify text-moox-navy mb-12 w-4/5 sm:w-full text-md">
            Moox Events Pvt. Ltd. is a Rajkot, Gujarat-based event management &
            wedding planning company dedicated to providing customers with a
            wide assortment of event management services for all sorts of
            corporate and personal events. Be it live shows, celebrity events,
            entertainment events, star nights, product launches, theme parties,
            wedding events, birthdays, anniversaries, Baby showers, corporate
            events, meet-up, and many more….
          </p>

          <div className="flex items-center justify-center gap-12 w-5/6 md:w-full flex-col md:flex-row">
            {/* Card 1: Creative Design */}
            <div className="h-96 w-full sm:w-4/5 md:w-1/3 justify-between flex flex-col items-center text-center bg-moox-navy text-white p-6 rounded-xl transform hover:scale-105 hover:shadow-lg transition-all duration-300 group">
              {/* Rotating SVG */}
              <div className="w-20 h-20 mb-6 rounded-full border-4 border-moox-gold flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-moox-gold transform transition-transform duration-1000 group-hover:-rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 5l7 7-7 7M5 13l7-7 7 7"
                  ></path>
                </svg>
              </div>

              {/* Card Content */}
              <h3 className="text-2xl font-semibold mb-3 text-moox-gold">
                Creative Design
              </h3>
              <p className="text-md opacity-90">
                We turn your ideas into reality with designs that perfectly
                reflect your brand and vision.
              </p>
              <div className="flex flex-row justify-center items-center mt-4 gap-3">
                <span className="text-moox-gold text-4xl">{clientsCount}+</span>{" "}
                clients served.
              </div>
            </div>

            {/* Card 2: Flawless Coordination */}
            <div className="h-96 w-full sm:w-4/5 md:w-1/3 flex flex-col items-center justify-between text-center bg-moox-navy text-white p-6 rounded-xl transform hover:scale-105 hover:shadow-lg transition-all duration-300">
              <div className="w-20 h-20 mb-6 rounded-full border-4 border-moox-gold flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-moox-gold"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-moox-gold">
                Flawless Coordination
              </h3>
              <p className="text-md opacity-90">
                Our expert coordinators ensure seamless execution, handling
                everything from A to Z so you don't have to.
              </p>
              <div className="flex flex-row justify-center items-center mt-4 gap-3">
                <span className="text-moox-gold text-4xl">{eventsCount}+</span>{" "}
                events organized.
              </div>
            </div>

            {/* Card 3: Timely Execution */}
            <div className="h-96 w-full sm:w-4/5 md:w-1/3 flex flex-col items-center justify-between text-center bg-moox-navy text-white p-6 rounded-xl transform hover:scale-105 hover:shadow-lg transition-all duration-300">
              <div className="w-20 h-20 mb-6 rounded-full border-4 border-moox-gold flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-moox-gold"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-moox-gold">
                Timely Execution
              </h3>
              <p className="text-md opacity-90">
                We prioritize efficiency and punctuality, ensuring your event
                goes off without a hitch—right on schedule.
              </p>
              <div className="flex flex-row justify-center items-center mt-4 gap-3">
                <span className="text-moox-gold text-4xl">
                  {categoriesCount}+
                </span>{" "}
                categories of events.
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-12 flex justify-center animate__animated animate__fadeIn animate__delay-4s">
            <a
              href="/contact"
              className="px-8 py-3 text-lg font-semibold bg-moox-gold text-moox-navy rounded-full hover:bg-moox-navy hover:text-white transition duration-300 ease-in-out"
            >
              Let's Plan Your Event
            </a>
          </div>
        </div>

        {/* Right side: ABOUT Letters animation (hidden on mobile/tablet) */}
        <div className="hidden md:flex w-[150px] h-auto items-start">
          <div className="w-full gap-3 flex flex-col">
            {" A B O U T".split(" ").map((letter, index) => (
              <div
                key={index}
                className={`w-full flex items-end justify-end text-7xl font-bold text-moox-gold opacity-90 animate__animated animate__fadeIn animate__delay-${
                  index + 1
                }s`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {letter}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
