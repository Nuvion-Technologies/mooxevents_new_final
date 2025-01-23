import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Briefcase, Users, XCircle, CheckCircle, X, Loader } from "lucide-react";

const CareerManagement = () => {
  const ip = import.meta.env.VITE_IP;
  const [positions, setPositions] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [newPosition, setNewPosition] = useState({
    position_name: "",
    description: "",
    location: "",
    requirements: "",
  });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [messageVisible, setMessageVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPositions = async () => {
    try {
      const user_id = localStorage.getItem("userid");
      if (!user_id) {
        showNotification("User not authenticated.");
        return;
      }
      const { data } = await axios.post(`${ip}/moox_events/api/career/all`, {
        user_id,
      });
      setPositions(data.events);
      setLoading(false);
    } catch (error) {
      showNotification("Failed to fetch positions.");
      setLoading(false);
    }
  };

  const showNotification = (msg) => {
    setMessage(msg);
    setMessageVisible(true);
    setTimeout(() => {
      setMessageVisible(false);
    }, 2000);
  };

  const togglePositionStatus = async (id) => {
    try {
      const user_id = localStorage.getItem("userid");
      if (!user_id) {
        showNotification("User not authenticated.");
        return;
      }
      await axios.post(`${ip}/moox_events/api/career/toggle`, { user_id, id });
      fetchPositions();
      showNotification("Position status updated successfully.");
    } catch (error) {
      showNotification("Failed to update position status.");
    }
  };

  const fetchApplications = async (positionId) => {
    try {
      const user_id = localStorage.getItem("userid");
      if (!user_id) {
        showNotification("User not authenticated.");
        return;
      }
      const { data } = await axios.post(
        `${ip}/moox_events/api/career/applications`,
        { user_id, position_id: positionId }
      );
      setApplications(data);
      setSelectedPosition(positionId);
    } catch (error) {
      showNotification("Failed to fetch applications.");
    }
  };

  const handleAddPosition = async () => {
    try {
      const user_id = localStorage.getItem("userid");
      if (!user_id) {
        showNotification("User not authenticated.");
        return;
      }
      if (
        !newPosition.position_name ||
        !newPosition.description ||
        !newPosition.requirements
      ) {
        showNotification("Please fill in all fields.");
        return;
      }
      await axios.post(`${ip}/moox_events/api/career/add-position`, {
        ...newPosition,
        user_id,
      });
      fetchPositions();
      setNewPosition({
        position_name: "",
        description: "",
        location: "",
        requirements: "",
      });
      setIsFormVisible(false);
      showNotification("Position added successfully.");
    } catch (error) {
      showNotification("Failed to add position.");
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDF8DA] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-[#1a2a47] rounded-2xl p-6 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[#d6af53]/10"></div>
          <div className="relative">
            <h2 className="text-3xl font-bold text-white mb-2">
              Career Management
            </h2>
            <p className="text-[#d6af53] font-medium">
              Add and manage career positions
            </p>
          </div>
        </div>

        {/* Toggle Form Button */}
        <button
          onClick={() => setIsFormVisible(true)}
          className="mb-8 bg-[#1a2a47] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#d6af53] focus:outline-none focus:ring-2 focus:ring-[#d6af53] focus:ring-offset-2 transform transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Add New Position
        </button>

        {/* Add Position Form */}
        {isFormVisible && (
          <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"></div>
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-xl z-50">
              <div className="bg-white rounded-2xl shadow-xl border border-[#d6af53]/20 overflow-hidden mb-8">
                <div className="p-6 sm:p-8">
                  <h3 className="text-xl font-semibold text-[#1a2a47] mb-6">
                    Add New Position
                  </h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-[#1a2a47] mb-2">
                          Position Name
                        </label>
                        <input
                          type="text"
                          placeholder="Enter position name"
                          value={newPosition.position_name}
                          onChange={(e) =>
                            setNewPosition({
                              ...newPosition,
                              position_name: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-[#d6af53]/30 rounded-lg focus:ring-2 focus:ring-[#d6af53] focus:border-transparent transition-all duration-200 bg-white/50 hover:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1a2a47] mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          placeholder="Enter location"
                          value={newPosition.location}
                          onChange={(e) =>
                            setNewPosition({
                              ...newPosition,
                              location: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-[#d6af53]/30 rounded-lg focus:ring-2 focus:ring-[#d6af53] focus:border-transparent transition-all duration-200 bg-white/50 hover:bg-white"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-[#1a2a47] mb-2">
                          Description
                        </label>
                        <textarea
                          placeholder="Enter description"
                          value={newPosition.description}
                          onChange={(e) =>
                            setNewPosition({
                              ...newPosition,
                              description: e.target.value,
                            })
                          }
                          rows="4"
                          className="w-full px-4 py-3 border border-[#d6af53]/30 rounded-lg focus:ring-2 focus:ring-[#d6af53] focus:border-transparent transition-all duration-200 bg-white/50 hover:bg-white"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-[#1a2a47] mb-2">
                          Requirements
                        </label>
                        <textarea
                          placeholder="Enter requirements"
                          value={newPosition.requirements}
                          onChange={(e) =>
                            setNewPosition({
                              ...newPosition,
                              requirements: e.target.value,
                            })
                          }
                          rows="4"
                          className="w-full px-4 py-3 border border-[#d6af53]/30 rounded-lg focus:ring-2 focus:ring-[#d6af53] focus:border-transparent transition-all duration-200 bg-white/50 hover:bg-white"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={handleAddPosition}
                        className="flex-1 bg-[#1a2a47] text-white py-3.5 px-4 rounded-lg font-semibold hover:bg-[#d6af53] focus:outline-none focus:ring-2 focus:ring-[#d6af53] focus:ring-offset-2 transform transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                      >
                        <Plus className="w-5 h-5" />
                        Add Position
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsFormVisible(false)}
                        className="flex-1 bg-gray-200 text-gray-800 py-3.5 px-4 rounded-lg font-semibold hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transform transition-all duration-300 hover:scale-[1.02]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Positions Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
          <Loader className="w-8 h-8 text-[#1a2a47] animate-spin" />
      </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {positions.map((position) => (
            <div
              key={position._id}
              className="group relative bg-white rounded-2xl shadow-xl border border-[#d6af53]/10 overflow-hidden transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl hover:border-[#d6af53]/30"
            >
              <div className="p-6">
                {/* Status Badge */}
                <div
                  className={`absolute top-4 right-4 px-4 py-1.5 rounded-full text-sm font-medium shadow-lg backdrop-blur-sm ${
                    position.active
                      ? "bg-green-500/90 text-white"
                      : "bg-red-500/90 text-white"
                  }`}
                >
                  {position.active ? "Active" : "Inactive"}
                </div>

                <div className="mb-6">
                  <Briefcase className="w-10 h-10 text-[#d6af53] mb-4" />
                  <h3 className="text-xl font-bold text-[#1a2a47] mb-2">
                    {position.position_name}
                  </h3>
                  <p className="text-gray-600 mb-2">{position.description}</p>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <strong>Requirements:</strong> {position.requirements}
                    </p>
                    <p>
                      <strong>Location:</strong> {position.location}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => togglePositionStatus(position._id)}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 ${
                      position.active
                        ? "bg-red-500/90 text-white hover:bg-red-600"
                        : "bg-green-500/90 text-white hover:bg-green-600"
                    }`}
                  >
                    {position.active ? (
                      <>
                        <XCircle className="w-5 h-5" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Activate
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => fetchApplications(position._id)}
                    className="flex-1 bg-[#1a2a47] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#d6af53] transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    <Users className="w-5 h-5" />
                    Applications
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Applications Section */}
        {/* Applications Popup */}
        {selectedPosition && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setSelectedPosition(null)}>
            <div className="bg-white rounded-2xl shadow-xl border border-[#d6af53]/20 overflow-hidden w-full max-w-4xl mx-4 relative">
              <div className="p-6 sm:p-8">
                <button
                  onClick={() => setSelectedPosition(null)}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  aria-label="Close applications popup"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>

                <h3 className="text-xl font-semibold text-[#1a2a47] mb-6 flex items-center gap-2 pr-12">
                  <Users className="w-6 h-6" />
                  Applications for{" "}
                  {
                    positions.find((pos) => pos._id === selectedPosition)
                      ?.position_name
                  }
                </h3>

                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  {applications.length > 0 ? (
                    applications.map((app) => (
                      <div
                        key={app._id}
                        className="p-4 bg-gray-50 rounded-lg border border-[#d6af53]/10 hover:border-[#d6af53]/30 transition-all duration-300"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <p className="text-[#1a2a47]">
                            <strong>Name:</strong> {app.name}
                          </p>
                          <p className="text-[#1a2a47]">
                            <strong>Email:</strong> {app.email}
                          </p>
                          <p className="text-[#1a2a47]">
                            <strong>Mobile:</strong> {app.mobile}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600 text-center py-4">
                      No applications found for this position.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Notification */}
      {messageVisible && (
        <div className="fixed bottom-4 right-4 bg-[#1a2a47] text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 animate-fade-in">
          {message}
        </div>
      )}
    </div>
  );
};

export default CareerManagement;
