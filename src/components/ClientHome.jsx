import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClientHome = ({ onDataLoaded }) => {
  const ip = import.meta.env.VITE_IP;
  const [clients, setClients] = useState([]); // State to store clients
  const [isLoading, setIsLoading] = useState(true); // Local loading state
  const apiUrl = `${ip}/moox_events/api/client/get-all-client`; // Backend API URL

  // Fetch clients from the API
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.post(apiUrl);
        const data = response.data;

        if (data && data.clients) {
          setClients(data.clients); // Set clients data in state
        } else {
          console.error("Clients data is missing.");
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setIsLoading(false);
        onDataLoaded(); // Notify parent component that data has been loaded
      }
    };

    fetchClients();
  }, [onDataLoaded]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#DBAF76]"></div>
      </div>
    );
  }

  // No clients found state
  if (clients.length === 0) {
    return (
      <div className="py-12 font-parkin text-center">
        <p>No clients found.</p>
      </div>
    );
  }

  return (
    <div className="py-12 font-parkin">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
          data-aos="fade-up" // AOS animation for the grid
        >
          {clients.map((client, index) => (
            <div
              key={client._id} // Ensure unique identifier for the key
              className="relative flex flex-col items-center justify-center p-4 rounded-lg bg-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl"
                data-aos="zoom-in" // AOS animation for each card
                data-aos-delay={`${index * 100}`} // Staggered delay for each client card
            >
              {/* Logo */}
              <img
                src={client.logo} // Dynamically fetched logo
                alt={client.name}
                className="w-20 h-20 sm:w-24 sm:h-24 transition-transform duration-300 object-cover rounded-lg group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientHome;
