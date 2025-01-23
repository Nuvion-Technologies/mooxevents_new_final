import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, ZoomIn } from "lucide-react";

const GalleryHome = ({ onGalleryLoadComplete }) => {
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const ip = import.meta.env.VITE_IP;

  const openModal = (content) => {
    setModalContent(content);
    setModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent(null);
    document.body.style.overflow = "unset";
  };

  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        const response = await axios.post(
          `${ip}/moox_events/api/gallery/get-all-photos`
        );
        const data = response.data;
        //console.log("Gallery items:",data);

        if (data.clients) {
          const lastTnClients = data.clients.slice(-10);
          const items = lastTnClients.map((client) => ({
            type: client.logo ? "image" : "video",
            src: client.logo,
            description: client.description
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

  // Split items into columns for masonry layout
  const columns = {
    sm: 2,
    md: 3,
    lg: 4,
  };

  const getColumns = () => {
    const columnArrays = Array.from({ length: columns.lg }, () => []);
    galleryItems.forEach((item, index) => {
      columnArrays[index % columns.lg].push(item);
    });
    return columnArrays;
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#DBAF76]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {getColumns().map((column, columnIndex) => (
            <div key={columnIndex} className="flex flex-col gap-4">
              {column.map((item, itemIndex) => (
                <div
                  key={`${columnIndex}-${itemIndex}`}
                  className="relative group  animate-photoAppear break-inside-avoid"
                  onClick={() => openModal(item)}
                >
                  {item.type === "image" ? (
                    <div className="relative">
                      <img
                        src={item.src}
                        alt={item.description || `Gallery item ${itemIndex + 1}`}
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
            className="relative max-w-5xl w-full animate-modalEntry"
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

export default GalleryHome;
