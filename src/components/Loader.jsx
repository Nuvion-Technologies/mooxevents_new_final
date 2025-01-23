// import React, { useState } from "react";
// import { useTrail, animated } from "@react-spring/web";

// // Custom Circle Image (update the path to your circle logo)
// import designerCircle from '../../public/circle.png';

// const Loader = () => {
//   const slogans = [
//     "Loading your experience...",
//     "Bringing the best to you...",
//     "Almost there...",
//     "Hang tight...",
//   ];

//   // State to control slogan animation
//   const [currentSlogan, setCurrentSlogan] = useState(0);

//   // React Spring for writing animation effect
//   const [trail, set] = useState(
//     new Array(slogans.length).fill(false)
//   );

//   // Trail animation for typing effect
//   const trailAnimation = useTrail(slogans.length, {
//     opacity: trail ? 1 : 0,
//     transform: trail ? "translateY(0)" : "translateY(20px)",
//     from: { opacity: 0, transform: "translateY(20px)" },
//     onRest: () => {
//       if (currentSlogan < slogans.length - 1) {
//         setCurrentSlogan(currentSlogan + 1); // Move to the next slogan
//       } else {
//         setCurrentSlogan(0); // Restart the slogans
//       }
//       set(true);
//     },
//     config: { tension: 400, friction: 100 },
//   });

//   // Set interval for switching slogans every 3 seconds (1s animation + 2s wait)
//   React.useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentSlogan((prev) => (prev + 1) % slogans.length);
//     }, 4000); // 1s typing + 3s rest
//     return () => clearInterval(interval);
//   }, [currentSlogan]);

//   return (
//     <div className="absolute w-full h-screen flex flex-col justify-center items-center bg-gray-900 z-[100] overflow-hidden overscroll-none">
//       {/* Spinning Custom Circle Image at the bottom */}
//       <div className="absolute bottom-[-500px] transform">
//         <img
//           src={designerCircle} // Your custom image for the circle
//           alt="Loading"
//           className="w-[1000px] h-[1000px] object-contain spin-slow"
//         />
//       </div>

//       <style>
//         {`
//           @keyframes spin-slow {
//             0% {
//               transform: rotate(0deg);
//             }
//             100% {
//               transform: rotate(360deg);
//             }
//           }
  
//           .spin-slow {
//             animation: spin-slow 15s linear infinite; /* Slow spin animation */
//           }

//           /* Disable overscroll behavior */
//           .overscroll-none {
//             overscroll-behavior: none; /* Disables overscroll */
//             touch-action: none; /* Prevents any gestures that could trigger scroll */
//           }
//         `}
//       </style>

//       {/* Slogans in the center of the screen */}
//       <div className="absolute top-1/3 transform -translate-y-1/2 text-white text-2xl sm:text-3xl lg:text-4xl font-parkin text-center">
//         {trailAnimation.map((style, index) => (
//           <animated.div
//             key={index}
//             className="py-2"
//             style={{
//               display: currentSlogan === index ? "block" : "none", // Only show the current slogan
//             }}
//           >
//             <p>{slogans[index]}</p>
//           </animated.div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Loader;



import React, { useState, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";

// Custom Circle Image (update the path to your circle logo)
import designerCircle from '../../public/circle.png';

const Loader = () => {
    const slogans = [
        "Crafting unforgettable moments just for you",
        "Turning your visions into reality",
        "Preparing the stage for perfection",
        "Bringing magic to every occasion",
      ];
      

  const [currentSlogan, setCurrentSlogan] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  // React Spring animation for fade-in, visible, and fade-out
  const fadeAnimation = useSpring({
    opacity: isAnimating ? 1 : 0,
    config: { duration: 1000 }, // 1s for fade-in/out
  });

  useEffect(() => {
    const totalDuration = 2000; // Total duration per slogan (5s)
    const visibleDuration = 1000; // Time fully visible (3s)

    const interval = setInterval(() => {
      setIsAnimating(false); // Start fade-out
      setTimeout(() => {
        setCurrentSlogan((prev) => (prev + 1) % slogans.length); // Move to the next slogan
        setIsAnimating(true); // Start fade-in
      }, 500); // Wait for fade-out to complete (1s)
    }, totalDuration); // Total cycle: 1s fade-in + 3s visible + 1s fade-out

    return () => clearInterval(interval); // Clean up on component unmount
  }, []);

  return (
    <div className="absolute w-full h-screen flex flex-col justify-center items-center bg-gray-900 z-40 overflow-hidden overscroll-none">
      {/* Spinning Custom Circle Image */}
      <div className="absolute bottom-[-500px] transform">
        <img
          src={designerCircle}
          alt="Loading"
          className="w-[900px] h-[900px] object-contain spin-slow"
        />
      </div>

      <style>
        {`
          @keyframes spin-slow {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
  
          .spin-slow {
            animation: spin-slow 15s linear infinite;
          }

          .overscroll-none {
            overscroll-behavior: none;
            touch-action: none;
          }
        `}
      </style>

      {/* Slogans */}
      <div className="absolute top-1/3 transform -translate-y-1/2 text-white text-2xl sm:text-3xl lg:text-4xl font-parkin text-center">
        <animated.div style={fadeAnimation}>
          <p>{slogans[currentSlogan]}</p>
        </animated.div>
      </div>
    </div>
  );
};

export default Loader;
