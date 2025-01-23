import React, { useState, useEffect } from "react";
import axios from "axios";
import imageCompression from 'browser-image-compression';
import { Plus, Upload, ImagePlus, Loader } from "lucide-react";
import { set } from "rsuite/esm/internals/utils/date";

const ClientManagement = () => {
  const ip = import.meta.env.VITE_IP;
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    active: true,
    logo: "",
  });
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [messageVisible, setMessageVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState("");

  // Image compression function
  const compressImage = async (file) => {
    if (!file) return null;

    const options = {
      maxSizeMB: 0.05, // 50KB = 0.05MB
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      // Convert to File object with original name and type
      return new File([compressedFile], file.name, { type: file.type });
    } catch (error) {
      console.error("Error compressing image:", error);
      setError("Failed to compress image. Please try again.");
      return null;
    }
  };

  // Fetch clients on component load
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.post(
          `${ip}/moox_events/api/client/get-client`,
          { user_id: localStorage.getItem("userid") }
        );
        setClients(response.data.clients);
        setLoading(false);
      } catch (error) {
        setMessage(
          "Failed to fetch clients. " + error.response?.data?.message ||
            error.message
        );
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle photo upload with compression
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Check if file size is greater than 50KB (51200 bytes)
        const compressedFile = file.size > 51200 ? await compressImage(file) : file;
        
        if (compressedFile) {
          const reader = new FileReader();
          reader.readAsDataURL(compressedFile);
          reader.onloadend = () => {
            setPreviewImage(reader.result);
            setFormData({ ...formData, logo: reader.result.split(",")[1] });
          };
        }
      } catch (error) {
        console.error("Error handling file:", error);
        setError("Failed to process image. Please try again.");
      }
    }
  };

  // Submit new client
  const handleAddClient = async (e) => {
    e.preventDefault();

    if (!formData.logo) {
      setMessage("Please upload a photo.");
      setMessageVisible(true);
      setTimeout(() => setMessageVisible(false), 2000);
      return;
    }

    try {
      const response = await axios.post(
        `${ip}/moox_events/api/client/add-client`,
        {
          name: formData.name,
          active: true,
          user_id: localStorage.getItem("userid"),
          photo: formData.logo,
        }
      );

      setMessage(response.data.message);
      setClients((prevClients) => [...prevClients, response.data.client]);
      setFormData({ name: "", active: true, logo: "" });
      setPreviewImage(null);
      setShowPopup(false);
      setError("");

      setMessageVisible(true);
      setTimeout(() => setMessageVisible(false), 2000);
    } catch (error) {
      setMessage(
        "Failed to add client. " +
          (error.response?.data?.message || error.message)
      );
      setMessageVisible(true);
      setTimeout(() => setMessageVisible(false), 2000);
    }
  };

  // Toggle client active status
  const toggleStatus = async (clientId, currentStatus) => {
    try {
      const response = await axios.post(
        `${ip}/moox_events/api/client/change-client-status`,
        {
          event_id: clientId,
          user_id: localStorage.getItem("userid"),
          status: !currentStatus,
        }
      );
      setMessage(response.data.message);
      setClients((prevClients) =>
        prevClients.map((client) =>
          client._id === clientId
            ? { ...client, active: !currentStatus }
            : client
        )
      );
      setMessageVisible(true);
      setTimeout(() => setMessageVisible(false), 2000);
    } catch (error) {
      setMessage(
        "Failed to update client status. " +
          (error.response?.data?.message || error.message)
      );
      setMessageVisible(true);
      setTimeout(() => setMessageVisible(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8DA] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-[#1a2a47] rounded-2xl p-6 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[#d6af53]/10"></div>
          <div className="relative">
            <h2 className="text-3xl font-bold text-white mb-2">
              Client Management
            </h2>
            <p className="text-[#d6af53] font-medium">
              Add and manage your clients
            </p>
          </div>
        </div>

        {/* Add Client Button */}
        <button
          onClick={() => setShowPopup(true)}
          className="mb-8 bg-[#1a2a47] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#d6af53] focus:outline-none focus:ring-2 focus:ring-[#d6af53] focus:ring-offset-2 transform transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Add New Client
        </button>

        {/* Form Popup */}
        {showPopup && (
          <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"></div>
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-xl z-50">
              <div className="bg-white rounded-2xl shadow-xl border border-[#d6af53]/20 overflow-hidden">
                <div className="p-6 sm:p-8">
                  <h3 className="text-xl font-semibold text-[#1a2a47] mb-6">
                    Add New Client
                  </h3>
                  <form onSubmit={handleAddClient} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-[#1a2a47] mb-2">
                        Client Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-[#d6af53]/30 rounded-lg focus:ring-2 focus:ring-[#d6af53] focus:border-transparent transition-all duration-200 bg-white/50 hover:bg-white"
                        placeholder="Enter client name"
                      />
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium text-[#1a2a47] mb-2">
                        Client Photo
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          required
                          className="hidden"
                          id="client-photo"
                        />
                        <label
                          htmlFor="client-photo"
                          className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-[#d6af53]/30 rounded-lg  hover:border-[#d6af53] transition-all duration-200"
                        >
                          {previewImage ? (
                            <div className="relative w-full aspect-video">
                              <img
                                src={previewImage}
                                alt="Preview"
                                className="w-full h-full object-cover rounded-lg"
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                                <ImagePlus className="w-8 h-8 text-white" />
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-4">
                              <Upload className="w-8 h-8 text-[#d6af53] mb-2" />
                              <span className="text-sm text-gray-600">
                                Click to upload photo
                              </span>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className="flex-1 bg-[#1a2a47] text-white py-3.5 px-4 rounded-lg font-semibold hover:bg-[#d6af53] focus:outline-none focus:ring-2 focus:ring-[#d6af53] focus:ring-offset-2 transform transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                      >
                        <Plus className="w-5 h-5" />
                        Add Client
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowPopup(false);
                          setError("");
                        }}
                        className="flex-1 bg-gray-200 text-gray-800 py-3.5 px-4 rounded-lg font-semibold hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transform transition-all duration-300 hover:scale-[1.02]"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>

                  {error && (
                    <div className="mt-4 p-3 bg-red-500 text-white rounded-lg text-sm text-center animate-fade-in">
                      {error}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Clients Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader className="w-8 h-8 text-[#1a2a47] animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {clients.map((client) => (
              <div
                key={client._id}
                className="group relative h-[400px] bg-moox-navy rounded-2xl shadow-xl border border-[#d6af53]/10 overflow-hidden transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl hover:border-[#d6af53]/30"
              >
                {/* Full-size image with gradient overlay */}
                <img
                  src={client.logo}
                  alt={client.name}
                  className="absolute justify-self-center ot inset-0 pt-10 w-64 h-fit object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                {/* Status Badge */}
                <div
                  className={`absolute top-4 right-4 px-4 py-1.5 rounded-full text-sm font-medium shadow-lg backdrop-blur-sm ${
                    client.active
                      ? "bg-green-500/90 text-white"
                      : "bg-red-500/90 text-white"
                  }`}
                >
                  {client.active ? "Active" : "Inactive"}
                </div>

                {/* Client Name */}
                <div className="absolute bottom-20 left-6">
                  <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                    {client.name}
                  </h3>
                </div>

                {/* Action Button */}
                <div className="absolute bottom-6 left-6 right-6">
                  <button
                    onClick={() => toggleStatus(client._id, client.active)}
                    className={`w-full px-4 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg hover:shadow-xl ${
                      client.active
                        ? "bg-red-500/90 text-white hover:bg-red-600"
                        : "bg-green-500/90 text-white hover:bg-green-600"
                    }`}
                  >
                    {client.active ? "Deactivate Client" : "Activate Client"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Notification */}
      {messageVisible && (
        <div className="fixed bottom-4 right-4 bg-[#1a2a47] text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 animate-fade-in z-[9999]">
          {message}
        </div>
      )}
    </div>
  );
};

export default ClientManagement;