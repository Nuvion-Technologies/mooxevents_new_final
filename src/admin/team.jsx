import React, { useState, useEffect } from "react";
import axios from "axios";
import imageCompression from 'browser-image-compression';
import {
  Upload,
  CheckCircle,
  XCircle,
  Plus,
  ImagePlus,
  Loader,
  X,
} from "lucide-react";

const TeamManagement = () => {
  const ip = import.meta.env.VITE_IP;
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState({
    user_id: "",
    name: "",
    description: "",
    position: "",
    facebook_link: "",
    instagram_link: "",
    photo: null,
  });
  const [activeMembers, setActiveMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState("");

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

  const fetchMembers = async () => {
    try {
      const response = await axios.post(
        `${ip}/moox_events/api/team/get-all-member`,
        { user_id: localStorage.getItem("userid") }
      );
      setMembers(response.data.events);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching members:", error);
      setNotification("Failed to load team members");
      setTimeout(() => setNotification(""), 2000);
      setLoading(false);
    }
  };

  const fetchActiveMembers = async () => {
    try {
      const response = await axios.post(
        `${ip}/moox_events/api/team/get-active-members`
      );
      setActiveMembers(response.data.events);
    } catch (error) {
      console.error("Error fetching active members:", error);
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchActiveMembers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember({ ...newMember, [name]: value });
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Compress the image if needed
        const processedFile = await compressImage(file);
        if (processedFile) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviewImage(reader.result);
            setNewMember({ ...newMember, photo: reader.result.split(",")[1] });
          };
          reader.readAsDataURL(processedFile);
        }
      } catch (error) {
        console.error("Error processing image:", error);
        setNotification("Failed to process image");
        setTimeout(() => setNotification(""), 2000);
      }
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${ip}/moox_events/api/team/add-member`, {
        ...newMember,
        user_id: localStorage.getItem("userid"),
      });
      fetchMembers();
      setNotification("Member added successfully");
      setTimeout(() => setNotification(""), 2000);
      setIsFormVisible(false);
      setNewMember({
        user_id: "",
        name: "",
        description: "",
        position: "",
        facebook_link: "",
        instagram_link: "",
        photo: null,
      });
      setPreviewImage(null);
    } catch (error) {
      console.error("Error adding member:", error);
      setNotification("Failed to add member");
      setTimeout(() => setNotification(""), 2000);
    }
  };

  const handleToggleStatus = async (event_id, status) => {
    try {
      await axios.post(`${ip}/moox_events/api/team/change-member-status`, {
        event_id,
        status,
        user_id: localStorage.getItem("userid"),
      });
      fetchMembers();
      setNotification(
        `Member ${status ? "activated" : "deactivated"} successfully`
      );
      setTimeout(() => setNotification(""), 2000);
    } catch (error) {
      console.error("Error updating member status:", error);
      setNotification("Failed to update member status");
      setTimeout(() => setNotification(""), 2000);
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
              Team Management
            </h2>
            <p className="text-[#d6af53] font-medium">
              Manage your team members and their profiles
            </p>
          </div>
        </div>

        {/* Toggle Form Button */}
        <button
          onClick={() => setIsFormVisible(true)}
          className="mb-8 bg-[#1a2a47] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#d6af53] focus:outline-none focus:ring-2 focus:ring-[#d6af53] focus:ring-offset-2 transform transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Add New Member
        </button>

        {/* Modal Overlay */}
        {isFormVisible && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            {/* Modal Content */}
            <div className="bg-white rounded-2xl shadow-xl border border-[#d6af53]/20 overflow-hidden w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-[#1a2a47]">
                    Add New Member
                  </h3>
                </div>
                <form onSubmit={handleAddMember} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                      type="text"
                      name="name"
                      value={newMember.name}
                      onChange={handleInputChange}
                      placeholder="Name"
                      required
                      className="w-full px-4 py-3 border border-[#d6af53]/30 rounded-lg focus:ring-2 focus:ring-[#d6af53] focus:border-transparent transition-all duration-200 bg-white/50 hover:bg-white"
                    />
                    <input
                      type="text"
                      name="position"
                      value={newMember.position}
                      onChange={handleInputChange}
                      placeholder="Position"
                      required
                      className="w-full px-4 py-3 border border-[#d6af53]/30 rounded-lg focus:ring-2 focus:ring-[#d6af53] focus:border-transparent transition-all duration-200 bg-white/50 hover:bg-white"
                    />
                    <div className="md:col-span-2">
                      <textarea
                        name="description"
                        value={newMember.description}
                        onChange={handleInputChange}
                        placeholder="Description"
                        required
                        rows="4"
                        className="w-full px-4 py-3 border border-[#d6af53]/30 rounded-lg focus:ring-2 focus:ring-[#d6af53] focus:border-transparent transition-all duration-200 bg-white/50 hover:bg-white"
                      />
                    </div>
                    <input
                      type="text"
                      name="facebook_link"
                      value={newMember.facebook_link}
                      onChange={handleInputChange}
                      placeholder="Facebook Username"
                      className="w-full px-4 py-3 border border-[#d6af53]/30 rounded-lg focus:ring-2 focus:ring-[#d6af53] focus:border-transparent transition-all duration-200 bg-white/50 hover:bg-white"
                    />
                    <input
                      type="text"
                      name="instagram_link"
                      value={newMember.instagram_link}
                      onChange={handleInputChange}
                      placeholder="Instagram Username"
                      className="w-full px-4 py-3 border border-[#d6af53]/30 rounded-lg focus:ring-2 focus:ring-[#d6af53] focus:border-transparent transition-all duration-200 bg-white/50 hover:bg-white"
                    />
                    <div className="md:col-span-2">
                      <div className="relative">
                        <input
                          type="file"
                          onChange={handlePhotoChange}
                          required
                          className="hidden"
                          id="member-photo"
                        />
                        <label
                          htmlFor="member-photo"
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
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="flex-1 bg-[#1a2a47] text-white py-3.5 px-4 rounded-lg font-semibold hover:bg-[#d6af53] focus:outline-none focus:ring-2 focus:ring-[#d6af53] focus:ring-offset-2 transform transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                    >
                      <Plus className="w-5 h-5" />
                      Add Member
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
              </div>
            </div>
          </div>
        )}

        {/* Members Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader className="w-8 h-8 text-[#1a2a47] animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((member) => (
              <div
                key={member.id}
                className="group relative h-[400px] bg-white rounded-2xl shadow-xl border border-[#d6af53]/10 overflow-hidden transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl hover:border-[#d6af53]/30"
              >
                <img
                  src={member.photo}
                  alt={member.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Status Badge */}
                <div
                  className={`absolute top-4 right-4 px-4 py-1.5 rounded-full text-sm font-medium shadow-lg backdrop-blur-sm ${
                    member.active
                      ? "bg-green-500/90 text-white"
                      : "bg-red-500/90 text-white"
                  }`}
                >
                  {member.active ? "Active" : "Inactive"}
                </div>

                {/* Member Info */}
                <div className="absolute bottom-20 left-6">
                  <h3 className="text-2xl font-bold text-white drop-shadow-lg mb-2">
                    {member.name}
                  </h3>
                  <p className="text-[#d6af53] font-medium mb-2">
                    {member.position}
                  </p>
                  <p className="text-white/80 line-clamp-2 text-sm">
                    {member.description}
                  </p>
                  <div className="flex gap-4 mt-4">
                    {member.facebook_link && (
                      <a
                        href={`https://www.facebook.com/${member.facebook_link}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-[#d6af53] transition-colors"
                      >
                        Facebook
                      </a>
                    )}
                    {member.instagram_link && (
                      <a
                        href={`https://www.instagram.com/${member.instagram_link}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-[#d6af53] transition-colors"
                      >
                        Instagram
                      </a>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <div className="absolute bottom-6 right-6">
                  <button
                    onClick={() =>
                      handleToggleStatus(member.id, !member.active)
                    }
                    className={`flex items-center gap-2 px-4 h-10 rounded-full transition-all duration-300 ${
                      member.active
                        ? "bg-[#1a2a47]/80 text-white hover:bg-[#d6af53]"
                        : "bg-[#d6af53]/80 text-white hover:bg-[#1a2a47]"
                    }`}
                  >
                    {member.active ? (
                      <>
                        <XCircle className="w-5 h-5" />
                        <span>Deactivate</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Activate</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Notification */}
      {notification && (
        <div className="fixed bottom-4 right-4 bg-[#1a2a47] text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 animate-fade-in">
          {notification}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 animate-fade-in">
          {error}
        </div>
      )}
    </div>
  );
};

export default TeamManagement;