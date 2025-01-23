import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Menu from "../components/Menu";
import AOS from "aos";
import Loader from "../components/Loader";
import Blogs from "../components/Blogs"; // Removed blogData import
import { ChevronDown } from "lucide-react";
import axios from "axios";

const Events = () => {
  const ip = import.meta.env.VITE_IP;
  const [isLoading, setIsLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categories, setCategories] = useState(["All"]);
  const [blogs, setBlogs] = useState([]);

  const handleDataLoaded = () => {
    setIsLoading(false);
    setTimeout(() => setShowLoader(false), 1000);
  };

  // Fetch blogs and categories dynamically from the API
  useEffect(() => {
    const fetchBlogsAndCategories = async () => {
      try {
        const user_id = localStorage.getItem("userid");
        if (!user_id) {
          console.error("User not authenticated");
          return;
        }

        const response = await axios.post(`${ip}/moox_events/api/blogs/get-all-blogs`, { user_id });
        const fetchedBlogs = response.data.blogs || [];

        // Filter only active blogs
        const activeBlogs = fetchedBlogs.filter((blog) => blog.active);

        // Update blogs state
        setBlogs(activeBlogs);

        // Extract unique categories and filter out invalid values
        const uniqueCategories = [
          "All",
          ...new Set(activeBlogs.map((blog) => blog.category).filter(Boolean)),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching blogs and categories:", error);
      }
    };

    fetchBlogsAndCategories();
  }, [ip]);

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

  // Filter blogs by category
  const filteredBlogs =
    selectedCategory === "All"
      ? blogs
      : blogs.filter((blog) => blog.category === selectedCategory);

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

        {/* Category Filter */}
        <div
          className="container mx-auto px-4 mt-8 relative z-20"
          data-aos="fade-up"
          data-aos-duration="1500"
        >
          <div className="relative inline-block text-left">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="inline-flex justify-between items-center w-48 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DBAF76]"
            >
              {selectedCategory}
              <ChevronDown className="ml-2 h-4 w-4" />
            </button>

            {isDropdownOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1" role="menu">
                  {categories.map((category, index) => (
                    <button
                      key={`${category}-${index}`} // Fix: Ensures unique keys
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsDropdownOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        selectedCategory === category
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-700"
                      } hover:bg-gray-100`}
                      role="menuitem"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <br />
        {/* Pass the filtered blogs to the Blogs component */}
        <Blogs
          onDataLoaded={handleDataLoaded}
          blogs={filteredBlogs}
        />
        <br />
        <br />

        <Footer />
      </div>
    </>
  );
};

export default Events;
