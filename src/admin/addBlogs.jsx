import React, { useState, useEffect } from "react";
import axios from "axios";
import imageCompression from 'browser-image-compression';
import { Plus, Upload, CheckCircle, XCircle, Loader, X } from "lucide-react";

const BlogManagement = () => {
  const ip = import.meta.env.VITE_IP;
  const [blogs, setBlogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState("");
  const [loading, setLoading] = useState(true);
  const [messageVisible, setMessageVisible] = useState(false);
  const [error, setError] = useState("");
  const [newBlog, setNewBlog] = useState({
    title: "",
    description: "",
    read_time: "",
    date: "",
    author: "",
    tags: "",
    categoryName: "",
    profile_photo: null,
    photo1: null,
    photo2: null,
    photo3: null,
    photo4: null,
    photo5: null,
  });

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

  const fetchBlogs = async () => {
    try {
      const user_id = localStorage.getItem("userid");
      if (!user_id) {
        setNotification("User not authenticated.");
        setMessageVisible(true);
        setTimeout(() => setMessageVisible(false), 2000);
        return;
      }
      const response = await axios.post(
        `${ip}/moox_events/api/blogs/get-blogs`,
        { user_id }
      );
      setBlogs(response.data.blogs);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setNotification(
        "Failed to load blogs. " +
          (error.response?.data?.message || error.message)
      );
      setMessageVisible(true);
      setTimeout(() => setMessageVisible(false), 2000);
      setLoading(false);
    }
  };

  const handleAddBlog = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!newBlog.title || !newBlog.description || !newBlog.photo1) {
      setNotification(
        "Please fill in all required fields and upload at least one photo."
      );
      setMessageVisible(true);
      setTimeout(() => setMessageVisible(false), 2000);
      return;
    }

    try {
      const user_id = localStorage.getItem("userid");
      if (!user_id) {
        setNotification("User not authenticated.");
        setMessageVisible(true);
        setTimeout(() => setMessageVisible(false), 2000);
        return;
      }

      const formData = {
        user_id,
        title: newBlog.title,
        description: newBlog.description,
        readTime: newBlog.read_time,
        date: newBlog.date,
        author: newBlog.author,
        tags: newBlog.tags,
        category: newBlog.categoryName,
        profile_photo: newBlog.profile_photo?.split(",")[1] || "",
        photo1: newBlog.photo1?.split(",")[1] || "",
        photo2: newBlog.photo2?.split(",")[1] || "",
        photo3: newBlog.photo3?.split(",")[1] || "",
        photo4: newBlog.photo4?.split(",")[1] || "",
        photo5: newBlog.photo5?.split(",")[1] || "",
      };

      const response = await axios.post(
        `${ip}/moox_events/api/blogs/add-blog`,
        formData
      );

      //console.log("Blog added:", response.data.blog);

      setBlogs((prevBlogs) => [...prevBlogs, response.data.blog]);
      setNotification(response.data.message || "Blog added successfully!");
      setIsModalOpen(false);
      setNewBlog({
        title: "",
        description: "",
        read_time: "",
        date: "",
        author: "",
        tags: "",
        categoryName: "",
        profile_photo: null,
        photo1: null,
        photo2: null,
        photo3: null,
        photo4: null,
        photo5: null,
      });
      setError("");

      setMessageVisible(true);
      setTimeout(() => setMessageVisible(false), 2000);
      window.location.reload();
    } catch (error) {
      console.error("Error adding blog:", error);
      setNotification(
        "Failed to add blog. " +
          (error.response?.data?.message || error.message)
      );
      setMessageVisible(true);
      setTimeout(() => setMessageVisible(false), 2000);
    }
  };

  const handleToggleStatus = async (id, status) => {
    try {
      const user_id = localStorage.getItem("userid");
      if (!user_id) {
        setNotification("User not authenticated.");
        setMessageVisible(true);
        setTimeout(() => setMessageVisible(false), 2000);
        return;
      }

      const response = await axios.post(
        `${ip}/moox_events/api/blogs/change-blog-status`,
        {
          blog_id: id,
          user_id,
          status: !status,
        }
      );

      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog._id === id ? { ...blog, active: !status } : blog
        )
      );

      setNotification(
        response.data.message ||
          `Blog ${status ? "deactivated" : "activated"} successfully!`
      );
      setMessageVisible(true);
      setTimeout(() => setMessageVisible(false), 2000);
    } catch (error) {
      console.error("Error toggling blog status:", error);
      setNotification(
        "Failed to update blog status. " +
          (error.response?.data?.message || error.message)
      );
      setMessageVisible(true);
      setTimeout(() => setMessageVisible(false), 2000);
    }
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Check if file size is greater than 50KB (51200 bytes)
        const processedFile = file.size > 51200 ? await compressImage(file) : file;
        
        if (processedFile) {
          const reader = new FileReader();
          reader.onload = () => {
            setNewBlog((prev) => ({
              ...prev,
              [field]: reader.result,
            }));
          };
          reader.readAsDataURL(processedFile);
        }
      } catch (error) {
        console.error("Error handling file:", error);
        setError("Failed to process image. Please try again.");
        setMessageVisible(true);
        setTimeout(() => setMessageVisible(false), 2000);
      }
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Rest of the component remains exactly the same
  return (
    <div className="min-h-screen bg-[#FDF8DA] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-[#1a2a47] rounded-2xl p-6 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[#d6af53]/10"></div>
          <div className="relative">
            <h2 className="text-3xl font-bold text-white mb-2">
              Blog Management
            </h2>
            <p className="text-[#d6af53] font-medium">
              Create and manage your blog posts
            </p>
          </div>
        </div>

        {/* Add Blog Button */}
        <button
          onClick={() => {
            setIsModalOpen(true);
            setError("");
          }}
          className="mb-8 bg-[#1a2a47] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#d6af53] focus:outline-none focus:ring-2 focus:ring-[#d6af53] focus:ring-offset-2 transform transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Add New Blog
        </button>

        {/* Add Blog Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-[#1a2a47]">
                    Add New Blog
                  </h3>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setError("");
                    }}
                    className="text-gray-500 hover:text-[#d6af53]"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleAddBlog} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#1a2a47] mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={newBlog.title}
                        onChange={(e) =>
                          setNewBlog({ ...newBlog, title: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-[#d6af53]/30 rounded-lg focus:ring-2 focus:ring-[#d6af53] focus:border-transparent"
                        placeholder="Enter blog title"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1a2a47] mb-2">
                        Author
                      </label>
                      <input
                        type="text"
                        value={newBlog.author}
                        onChange={(e) =>
                          setNewBlog({ ...newBlog, author: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-[#d6af53]/30 rounded-lg focus:ring-2 focus:ring-[#d6af53] focus:border-transparent"
                        placeholder="Enter author name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1a2a47] mb-2">
                        Category
                      </label>
                      <input
                        type="text"
                        value={newBlog.categoryName}
                        onChange={(e) =>
                          setNewBlog({
                            ...newBlog,
                            categoryName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-[#d6af53]/30 rounded-lg focus:ring-2 focus:ring-[#d6af53] focus:border-transparent"
                        placeholder="Enter category"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1a2a47] mb-2">
                        Read Time
                      </label>
                      <input
                        type="text"
                        value={newBlog.read_time}
                        onChange={(e) =>
                          setNewBlog({ ...newBlog, read_time: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-[#d6af53]/30 rounded-lg focus:ring-2 focus:ring-[#d6af53] focus:border-transparent"
                        placeholder="e.g., 5 min read"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1a2a47] mb-2">
                        Date
                      </label>
                      <input
                        type="date"
                        value={newBlog.date}
                        onChange={(e) =>
                          setNewBlog({ ...newBlog, date: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-[#d6af53]/30 rounded-lg focus:ring-2 focus:ring-[#d6af53] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1a2a47] mb-2">
                        Tags
                      </label>
                      <input
                        type="text"
                        value={newBlog.tags}
                        onChange={(e) =>
                          setNewBlog({ ...newBlog, tags: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-[#d6af53]/30 rounded-lg focus:ring-2 focus:ring-[#d6af53] focus:border-transparent"
                        placeholder="Enter tags (comma separated)"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-[#1a2a47] mb-2">
                        Description *
                      </label>
                      <textarea
                        value={newBlog.description}
                        onChange={(e) =>
                          setNewBlog({
                            ...newBlog,
                            description: e.target.value,
                          })
                        }
                        rows={6}
                        className="w-full px-4 py-3 border border-[#d6af53]/30 rounded-lg focus:ring-2 focus:ring-[#d6af53] focus:border-transparent"
                        placeholder="Enter blog description"
                        required
                      />
                    </div>
                  </div>

                  {/* Image Upload Section */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#1a2a47] mb-2">
                        Profile Photo
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "profile_photo")}
                        className="hidden"
                        id="profile-photo"
                      />
                      <label
                        htmlFor="profile-photo"
                        className="flex items-center justify-center w-full h-32 border-2 border-dashed border-[#d6af53]/30 rounded-lg  hover:border-[#d6af53]"
                      >
                        {newBlog.profile_photo ? (
                          <img
                            src={newBlog.profile_photo}
                            alt="Profile Preview"
                            className="h-full w-full object-cover rounded-lg"
                          />
                        ) : (
                          <Upload className="w-8 h-8 text-[#d6af53]" />
                        )}
                      </label>
                    </div>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <div key={num}>
                        <label className="block text-sm font-medium text-[#1a2a47] mb-2">
                          Photo {num} {num === 1 && "*"}
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, `photo${num}`)}
                          className="hidden"
                          id={`photo-${num}`}
                          required={num === 1}
                        />
                        <label
                          htmlFor={`photo-${num}`}
                          className="flex items-center justify-center w-full h-32 border-2 border-dashed border-[#d6af53]/30 rounded-lg  hover:border-[#d6af53]"
                        >
                          {newBlog[`photo${num}`] ? (
                            <img
                              src={newBlog[`photo${num}`]}
                              alt={`Photo ${num} Preview`}
                              className="h-full w-full object-cover rounded-lg"
                            />
                          ) : (
                            <Upload className="w-8 h-8 text-[#d6af53]" />
                          )}
                        </label>
                      </div>
                    ))}
                  </div>

                  {error && (
                    <div className="p-3 bg-red-500 text-white rounded-lg text-sm text-center">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-[#1a2a47] text-white py-3.5 px-4 rounded-lg font-semibold hover:bg-[#d6af53] focus:outline-none focus:ring-2 focus:ring-[#d6af53] focus:ring-offset-2 transform transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add Blog
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Blogs Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader className="w-8 h-8 text-[#1a2a47] animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="group relative h-[500px] bg-white rounded-2xl shadow-xl border border-[#d6af53]/10 overflow-hidden transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl hover:border-[#d6af53]/30"
              >
                {/* Main Image */}
                <img
                  src={blog.photo1}
                  alt={blog.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                {/* Status Badge */}
                <div
                  className={`absolute top-4 right-4 px-4 py-1.5 rounded-full text-sm font-medium shadow-lg backdrop-blur-sm ${
                    blog.active
                      ? "bg-green-500/90 text-white"
                      : "bg-red-500/90 text-white"
                  }`}
                >
                  {blog.active ? "Active" : "Inactive"}
                </div>

                {/* Blog Info */}
                <div className="absolute bottom-24 left-6 right-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={blog.profile_photo}
                      alt={blog.author}
                      className="w-12 h-12 rounded-full border-2 border-white"
                    />
                    <div>
                      <p className="text-white font-medium">{blog.author}</p>
                      <p className="text-white/70 text-sm">
                        {new Date(blog.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {blog.title}
                  </h3>
                  <p className="text-white/80 line-clamp-2 text-sm mb-2">
                    {blog.description}
                  </p>
                  <div className="flex items-center gap-4 text-white/70 text-sm">
                    <span>{blog.categoryName}</span>
                    <span>•</span>
                    <span>{blog.read_time}</span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="absolute bottom-6 right-6">
                  <button
                    onClick={() => handleToggleStatus(blog._id, blog.active)}
                    className={`flex items-center gap-2 px-4 h-10 rounded-full transition-all duration-300 ${
                      blog.active
                        ? "bg-[#1a2a47]/80 text-white hover:bg-[#d6af53]"
                        : "bg-[#d6af53]/80 text-white hover:bg-[#1a2a47]"
                    }`}
                  >
                    {blog.active ? (
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
      {messageVisible && notification && (
        <div className="fixed bottom-4 right-4 bg-[#1a2a47] text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 animate-fade-in">
          {notification}
        </div>
      )}
    </div>
  );
};

export default BlogManagement;