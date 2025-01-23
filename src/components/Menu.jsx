import React, { useState, useEffect } from "react";
import { Squash as HamburgerSquash } from "hamburger-react";
import { useSpring, animated, useTrail } from "@react-spring/web";
import { Link } from "react-router-dom";

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  let lastScrollY = 0;

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;

      if (scrollTop > lastScrollY && !isOpen) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setShowLogo(scrollTop > 50);
      setIsScrolled(scrollTop > 10);

      lastScrollY = scrollTop > 0 ? scrollTop : 0;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  const menuAnimation = useSpring({
    transform: isOpen ? "translateY(0%)" : "translateY(-100%)",
    opacity: isOpen ? 1 : 0,
    config: { tension: 130, friction: 30 },
  });

  const items = [
    { name: "Home", link: "/" },
    { name: "About Us", link: "/about" },
    { name: "Services", link: "/services" },
    { name: "Blogs", link: "/events" },
    { name: "Gallery", link: "/gallery" },
    { name: "Career", link: "/career" },
    { name: "Contact", link: "/contact" },
  ];

  const trail = useTrail(items.length, {
    opacity: isOpen ? 1 : 0,
    from: { opacity: 0 },
    config: { tension: 220, friction: 20 },
    reset: true,
  });

  return (
    <>
      {/* Navbar */}
      <div
        className={`fixed z-50 w-full transition-all duration-300 ${
          isOpen
            ? "bg-transparent h-16"
            : isScrolled
            ? "bg-white/95 backdrop-blur-sm h-20"
            : "bg-transparent h-20"
        } ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="h-full px-5 md:px-10 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/">
              <img
                src="/logo.png"
                alt="Logo"
                className={`w-28 transition-opacity duration-300 ${
                  isOpen || !showLogo ? "opacity-0" : "opacity-100"
                }`}
                style={{
                  filter: "drop-shadow(0 0px 6px rgba(255, 255, 255, 0.1))",
                }}
              />
            </Link>
          </div>
          
          <div className="z-50 flex items-center">
            <HamburgerSquash
              toggled={isOpen}
              toggle={setIsOpen}
              size={25}
              direction="left"
              duration={0.3}
              distance="lg"
              rounded
              label="Show menu"
              color="#DBAF76"
              easing="ease-in"
            />
          </div>
        </div>
      </div>

      {/* Fullscreen Menu */}
      <animated.div
        style={menuAnimation}
        className="fixed top-0 left-0 w-full h-screen z-40 bg-gray-900/95 backdrop-blur-md"
      >
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end h-full py-28 px-6 sm:py-20 sm:px-10 lg:px-28">
          {/* Main Menu Items */}
          <div className="flex flex-col gap-6 sm:gap-10 w-full text-center md:text-left">
            {trail.map((style, index) => (
              <animated.a
                key={items[index].name}
                href={items[index].link}
                style={style}
                className="font-parkin font-bold text-3xl sm:text-4xl text-[#DBAF76] lg:text-5xl"
              >
                <span
                  className="relative hover:text-white transition duration-300"
                  onMouseEnter={(e) =>
                    (e.target.style.textShadow = "0px 0px 10px rgba(219, 175, 118, 0.4)")
                  }
                  onMouseLeave={(e) => (e.target.style.textShadow = "none")}
                >
                  {items[index].name}
                </span>
              </animated.a>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-center md:flex-row gap-3 md:gap-5 mt-10 md:mt-0">
            <animated.a
              href="https://www.instagram.com/mooxevents/"
              target="_blank"
              style={trail[items.length - 2]}
              className="font-parkin font-bold text-lg sm:text-xl text-[#DBAF76] lg:text-2xl hover:text-white transition duration-300"
              onMouseEnter={(e) =>
                (e.target.style.textShadow = "0px 0px 10px rgba(219, 175, 118, 0.4)")
              }
              onMouseLeave={(e) => (e.target.style.textShadow = "none")}
            >
              Instagram
            </animated.a>
            <animated.a
              href="https://www.facebook.com/mooxevents/"
              target="_blank"
              style={trail[items.length - 1]}
              className="font-parkin font-bold text-lg sm:text-xl text-[#DBAF76] lg:text-2xl hover:text-white transition duration-300"
              onMouseEnter={(e) =>
                (e.target.style.textShadow = "0px 0px 10px rgba(219, 175, 118, 0.4)")
              }
              onMouseLeave={(e) => (e.target.style.textShadow = "none")}
            >
              Facebook
            </animated.a>
          </div>
        </div>
      </animated.div>
    </>
  );
};

export default Menu;
