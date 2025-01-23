import React, { useState, useEffect } from "react";
import axios from "axios";
import imageCompression from 'browser-image-compression';
import {
  Upload,
  CheckCircle,
  XCircle,
  Plus,
  ImagePlus,
  Pencil,
  Trash2,
  Loader,
} from "lucide-react";
import { set } from "rsuite/esm/internals/utils/date";

const AddService = () => {
  const ip = import.meta.env.VITE_IP;
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
  });
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [messageVisible, setMessageVisible] = useState(false);
  const [services, setServices] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentServiceId, setCurrentServiceId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(true);
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

  // Fetch all services when the component mounts
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const userId = localStorage.getItem("userid");
        const response = await axios.post(
          `${ip}/moox_events/api/service/get-service`,
          {
            user_id: userId,
          }
        );
        setServices(response.data.events);
        setLoading(false);
      } catch (error) {
        setMessage(
          "Failed to load services. " +
            (error.response?.data?.message || error.message)
        );
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  //console.log(services);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = async (e) => {
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
            setImage(compressedFile);
            setFormData({ ...formData, image: reader.result.split(",")[1] });
          };
        }
      } catch (error) {
        console.error("Error handling file:", error);
        setError("Failed to process image. Please try again.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      if (!currentServiceId) {
        setMessage("Please upload a image.");
        setMessageVisible(true);
        setTimeout(() => setMessageVisible(false), 1000);
        return;
      } else { 
        setMessage("Please upload a image again.");
        setMessageVisible(true);
        setTimeout(() => setMessageVisible(false), 1000);
        return;
      }
    }

    try {
      const userId = localStorage.getItem("userid");
      const endpoint = currentServiceId ? `${ip}/moox_events/api/service/update-service` : `${ip}/moox_events/api/service/add-service`;

      const payload = {
        user_id: userId,
        name: formData.name,
        description: formData.description,
        photo: formData.image, // Changed from 'image' to 'photo'
      };

      if (currentServiceId) {
        payload.id = currentServiceId;
      }

      const response = await axios.post(endpoint, payload);

      setMessage(response.data.message);

      if (currentServiceId) {
        const updatedServices = services.map(service =>
          service.id === currentServiceId ? response.data.service : service
        );
        setServices(updatedServices);
      } else {
        setServices([...services, response.data.service]);
      }

      setCurrentServiceId(null);
      setFormData({ title: "", description: "", image: "" });
      setPreviewImage(null);
      setImage(null);
      setIsFormVisible(false);
      setMessageVisible(true);
      setTimeout(() => setMessageVisible(false), 2000);
      window.location.reload();
    } catch (error) {
      setMessage(
        "Failed to add/update service. " +
          (error.response?.data?.message || error.message)
      );
      setMessageVisible(true);
      setTimeout(() => setMessageVisible(false), 2000);
    }
  };

  const handleEdit = (service) => {
    setFormData({ name: service.title, description: service.status, image: service.image });
    setCurrentServiceId(service.id);
    setPreviewImage(service.image);
    setIsFormVisible(true);
  };

  const handleStatusChange = async (serviceId, currentStatus) => {
    try {
      const response = await axios.post(`${ip}/moox_events/api/service/change-service-status`,
        {
          event_id: serviceId,
          user_id: localStorage.getItem("userid"),
          status: !currentStatus,
        }
      );

      setMessage(response.data.message);

      setServices((services) => services.map((service) =>
        service.id === serviceId
          ? { ...service, status: !currentStatus }
          : service
      ));
      setMessageVisible(true);
      setTimeout(() => setMessageVisible(false), 2000);
      window.location.reload();
    } catch (error) {
      setMessage(
        "Failed to update status. " +
          (error.response?.data?.message || error.message)
      );
      setMessageVisible(true);
      setTimeout(() => setMessageVisible(false), 2000);
    }
  };

  const handleDelete = async (serviceId) => {
    try {
      const userId = localStorage.getItem("userid");
      const response = await axios.post(`${ip}/moox_events/api/service/delete-service`,
        {
          event_id: serviceId,
          user_id: userId,
        }
      );

      setMessage(response.data.message);
      setTimeout(() => {
        setMessage("");
      }, 2000);

      const updatedServices = services.filter(service => service.id !== serviceId
      );
      setServices(updatedServices);
      // window.location.reload();
    } catch (error) {
      setMessage(
        "Failed to delete service. " +
          (error.response?.data?.message || error.message)
      );
      setTimeout(() => {
        setMessage("");
      }, 2000);
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
              Service Management
            </h2>
            <p className="text-[#d6af53] font-medium">
              Add and manage your services
            </p>
          </div>
        </div>

        {/* Toggle Form Button */}
        <button
          onClick={() => {
            setIsFormVisible(!isFormVisible);
            if (!isFormVisible) {
              setCurrentServiceId(null);
              setFormData({ title: "", description: "", image: "" });
              setImage(null);
              setPreviewImage(null);
            }
          }}
          className="mb-8 bg-[#1a2a47] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#d6af53] focus:outline-none focus:ring-2 focus:ring-[#d6af53] focus:ring-offset-2 transform transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Add New Service
        </button>

        {/* Form Section */}
        {isFormVisible && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
            <div className="bg-white rounded-2xl shadow-xl border border-[#d6af53]/20 overflow-hidden mb-4 max-w-lg w-full h-fit max-h-[94.5vh] overflow-y-auto">
              <div className="p-6 sm:p-8 relative">
                <h3 className="text-xl font-semibold text-[#1a2a47] mb-4">
                  {currentServiceId ? "Edit Service" : "Add New Service"}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-[#1a2a47] mb-2">
                        Service Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-[#d6af53]/30 rounded-lg focus:ring-2 focus:ring-[#d6af53] focus:border-transparent transition-all duration-200 bg-white/50 hover:bg-white"
                          placeholder="Enter service name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1a2a47] mb-2">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-4 py-3 border border-[#d6af53]/30 rounded-lg focus:ring-2 focus:ring-[#d6af53] focus:border-transparent transition-all duration-200 bg-white/50 hover:bg-white"
                        placeholder="Enter service description"
                      />
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium text-[#1a2a47] mb-2">
                        Service image <small>(You need to select image again if you are editing)</small>
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          required={!currentServiceId}
                          className="hidden"
                          id="service-image"
                        />
                        <label
                          htmlFor="service-image"
                          className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-[#d6af53]/30 rounded-lg cursor-pointer hover:border-[#d6af53] transition-all duration-200"
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
                                Click to upload image
                              </span>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="flex-1 bg-[#1a2a47] text-white py-3.5 px-4 rounded-lg font-semibold hover:bg-[#d6af53] focus:outline-none focus:ring-2 focus:ring-[#d6af53] focus:ring-offset-2 transform transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                    >
                      {currentServiceId ? (
                        <>
                          <Pencil className="w-5 h-5" />
                          Update Service
                        </>
                      ) : (
                        <>
                          <Plus className="w-5 h-5" />
                          Add Service
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsFormVisible(false)}
                      className="flex-1 bg-gray-200 text-gray-800 py-3.5 px-4 rounded-lg font-semibold hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transform transition-all duration-300 hover:scale-[1.02]"
                    >
                      Cancel
                    </button>
                  </div>
                </form>

                {message && (
                  <div className="mt-4 p-3 bg-[#1a2a47] text-white rounded-lg text-sm text-center animate-fade-in">
                    {message}
                  </div>
                )}

                {error && (
                  <div className="mt-4 p-3 bg-red-500 text-white rounded-lg text-sm text-center animate-fade-in">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        
        {/* Services Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
          <Loader className="w-8 h-8 text-[#1a2a47] animate-spin" />
      </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="group relative h-[400px] bg-white rounded-2xl shadow-xl border border-[#d6af53]/10 overflow-hidden transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl hover:border-[#d6af53]/30"
            >
              {/* Full-size image with gradient overlay */}
              <img
                src={service.image}
                alt={service.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              {/* Status Badge */}
              <div
                className={`absolute top-4 right-4 px-4 py-1.5 rounded-full text-sm font-medium shadow-lg backdrop-blur-sm ${
                  service.active
                    ? "bg-green-500/90 text-white"
                    : "bg-red-500/90 text-white"
                }`}
              >
                {service.active ? "Active" : "Inactive"}
              </div>

              {/* Service Title */}
              <div className="absolute bottom-20 left-6">
                <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                  {service.title}
                </h3>
                <p className="text-white line-clamp-2 text-md">
                  {service.status.split(":")[0].trim()}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="absolute bottom-6 right-6 flex items-center gap-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="flex items-center gap-2 max-w-[40px] hover:max-w-[130px] px-2 h-10 rounded-full bg-[#1a2a47]/80 text-white hover:bg-[#d6af53] transition-all duration-500 overflow-hidden group/edit"
                >
                  <Pencil className="h-5 flex-shrink-0" />
                  <span className="whitespace-nowrap opacity-0 group-hover/edit:opacity-100 transition-opacity duration-300">
                    Edit Service
                  </span>
                </button>

                <button
                  onClick={() =>
                    handleStatusChange(service.id, service.active)
                  }
                  className={`flex items-center gap-2 max-w-[40px] hover:max-w-[130px] px-2 h-10 rounded-full transition-all duration-500 overflow-hidden group/status ${
                    service.active
                      ? "bg-[#1a2a47]/80 text-white hover:bg-[#d6af53]"
                      : "bg-[#d6af53]/80 text-white hover:bg-[#1a2a47]"
                  }`}
                >
                  {service.active ? (
                    <>
                      <XCircle className="h-5 flex-shrink-0" />
                      <span className="whitespace-nowrap opacity-0 group-hover/status:opacity-100 transition-opacity duration-300">
                        Deactivate
                      </span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                      <span className="whitespace-nowrap opacity-0 group-hover/status:opacity-100 transition-opacity duration-300">
                        Activate
                      </span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDelete(service.id)}
                  className="flex items-center gap-2 max-w-[40px] hover:max-w-[130px] px-2 h-10 rounded-full bg-red-500/80 text-white hover:bg-red-600 transition-all duration-500 overflow-hidden group/delete"
                >
                  <Trash2 className="h-5 flex-shrink-0" />
                  <span className="whitespace-nowrap opacity-0 group-hover/delete:opacity-100 transition-opacity duration-300">
                    Delete
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>

      {/* Floating message */}
      {message && (
        <div className="fixed bottom-4 right-4 bg-[#1a2a47] text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 animate-fade-in">
          {message}
        </div>
      )}
    </div>
  );
};

export default AddService;