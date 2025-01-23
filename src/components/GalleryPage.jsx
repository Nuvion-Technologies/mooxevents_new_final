import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Loader2, ZoomIn } from "lucide-react";

const GalleryPage = ({ onGalleryLoadComplete }) => {
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [galleryItems, setGalleryItems] = useState([]);
  const [categories, setCategories] = useState(["All categories"]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All categories");
  const ip = import.meta.env.VITE_IP;

  const openModal = (content) => {
    setModalContent(content);
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent(null);
    document.body.style.overflow = 'unset';
  };

  // New function to format category name
  const formatCategoryName = (str) => {
    if (!str) return "";
    return str.replace(/([A-Z])/g, ' $1').trim();
  };

  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        const response = await axios.post(`${ip}/moox_events/api/gallery/get-all-photos`);
        const data = response.data;

        if (data.clients) {
          const uniqueCategories = new Set(
            data.clients
              .map(client => {
                const firstWord = client.description?.split(' ')[0];
                return firstWord ? formatCategoryName(firstWord) : null;
              })
              .filter(Boolean)
          );
          
          setCategories(["All categories", ...Array.from(uniqueCategories)]);

          const items = data.clients.map((client) => ({
            type: client.logo ? "image" : "video",
            src: client.logo,
            category: formatCategoryName(client.description?.split(' ')[0])
          }));

          setGalleryItems(items);
          setLoading(false);
          if (onGalleryLoadComplete) {
            onGalleryLoadComplete();
          }
        }
      } catch (error) {
        console.error("Error fetching gallery items:", error);
        setLoading(false);
      }
    };

    fetchGalleryItems();
  }, [onGalleryLoadComplete]);

  const filteredItems = activeCategory === "All categories" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  // Split items into columns for masonry layout
  const getColumns = () => {
    const columns = Array.from({ length: 4 }, () => []);
    filteredItems.forEach((item, index) => {
      columns[index % 4].push(item);
    });
    return columns;
  };

  return (
    <div className="container mx-auto px-4 py-8 lg:px-10 lg:py-16">
      {/* Category Filters */}
      <div className="flex items-center justify-center py-4 lg:py-8 flex-wrap">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`${
              activeCategory === category
                ? "bg-moox-navy border-2 dark:border-moox-navy dark:text-white dark:hover:bg-[#DBAF76]"
                : "dark:text-moox-navy dark:border-moox-navy dark:border-2 dark:hover:bg-[#DBAF76] dark:hover:text-white dark:hover:border-moox-navy  dark:hover:border-2"
            } border focus:outline-none focus:ring-gray-300 rounded-full text-base lg:text-base font-medium px-3 py-1.5 lg:px-5 lg:py-2.5 text-center me-2 lg:me-3 mb-3 dark:focus:ring-gray-800`}
          >
            {category}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {getColumns().map((column, columnIndex) => (
            <div key={columnIndex} className="flex flex-col gap-4">
              {column.map((item, itemIndex) => (
                <div
                  key={`${columnIndex}-${itemIndex}`}
                  className="relative group  break-inside-avoid"
                  onClick={() => openModal(item)}
                >
                  {item.type === "image" ? (
                    <div className="relative">
                      <img
                        src={item.src}
                        alt={`Gallery item ${itemIndex + 1}`}
                        className="w-full h-auto rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transform group-hover:scale-100 scale-50 transition-all duration-300">
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <video className="w-full h-auto rounded-lg">
                        <source src={item.src} type="video/mp4" />
                      </video>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div 
            className="relative max-w-xl w-full animate-modalEntry"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors duration-200"
            >
            </button>
            
            <div className="flex items-center justify-center">
              {modalContent?.type === "image" ? (
                <img
                  src={modalContent.src}
                  alt="Modal Content"
                  className="max-h-[80vh] w-auto object-contain rounded-lg animate-scaleIn"
                />
              ) : (
                <video
                  className="max-h-[80vh] w-auto rounded-lg animate-scaleIn"
                  controls
                  autoPlay
                >
                  <source src={modalContent?.src} type="video/mp4" />
                </video>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;