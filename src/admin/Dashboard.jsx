import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddService from "./addService";
import ClientManagement from "./addClient";
import Enquiry from "./enquiry";
import EventManagement from "./Events";
import GalleryManagement from "./Gallery";
import ContactUs from "./contactus";
import TeamManagement from "./team";
import CareerManagement from "./career";
import AchievementsManagement from "./acheivements";
import AddBlogs from "./addBlogs";
import { Menu, LogOut, X } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  const [activeComponent, setActiveComponent] = useState(() => {
    return localStorage.getItem("activeComponent") || "ManageServices";
  });
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    localStorage.setItem("activeComponent", activeComponent);
  }, [activeComponent]);

  const renderComponent = () => {
    switch (activeComponent) {
      case "ManageServices":
        return <AddService />;
      case "ManageClients":
        return <ClientManagement />;
      case "GalleryManagement":
        return <GalleryManagement />;
      case "CareerManagement":
        return <CareerManagement />;
      case "ManageBlogs":
        return <AddBlogs />;
      case "ContactUs":
        return <ContactUs />;
      case "TeamManagement":
        return <TeamManagement />;
      case "EnquiryManagement":
        return <Enquiry />;
      case "AchievementsManagement":
        return <AchievementsManagement />;
      default:
        return <div>Select an option from the sidebar.</div>;
    }
  };

  const menuItems = [
    { label: "Manage Services", key: "ManageServices" },
    { label: "Manage Clients", key: "ManageClients" },
    { label: "Gallery Management", key: "GalleryManagement" },
    { label: "Career Management", key: "CareerManagement" },
    { label: "Manage Blogs", key: "ManageBlogs" },
    { label: "Contact Us", key: "ContactUs" },
    { label: "Team Management", key: "TeamManagement" },
    { label: "Enquiry Management", key: "EnquiryManagement" },
    { label: "Achievements Management", key: "AchievementsManagement" },
  ];

  const handleLogout = () => {
    const activeComp = localStorage.getItem("activeComponent");
    localStorage.clear();
    localStorage.setItem("activeComponent", activeComp);
    navigate("/admin/login");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#FDF8DA]">
      {/* Sidebar Toggle Button for Mobile */}
      <button
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        className={`
          md:hidden fixed top-4 right-4 z-50 p-3 rounded-full
          transition-all duration-300 ease-in-out
          ${
            isSidebarOpen
              ? "bg-white text-[#d6af53] shadow-lg rotate-180 hover:rotate-360"
              : "bg-[#d6af53] text-white"
          }
        `}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static w-72 bg-gradient-to-br from-[#1a2a47] via-[#1a2a47] to-[#1a1a1a]
          text-white h-screen flex-shrink-0 transition-transform duration-300 ease-in-out z-40
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="h-full flex flex-col">
          <div className="py-2 bg-white m-3 rounded-xl shadow-bs2 shadow-black transform hover:scale-102 transition-transform duration-300">  
            <img
              src="/logo.png"
              alt="Moox Events Pvt Ltd Logo"
              className="h-16 sm:h-20 w-auto justify-self-center"
            />
            <h4 className="text-md font-semibold text-[#d6af53] justify-self-center uppercase">
              Admin Panel
            </h4>
          </div>
          <nav className="flex-1 px-3 py-4">
            <ul className="space-y-1.5">
              {menuItems.map((item) => (
                <li key={item.key}>
                  <button
                    onClick={() => {
                      setActiveComponent(item.key);
                      window.innerWidth < 1024 && setSidebarOpen(false);
                    }}
                    className={`
                      w-full px-4 py-2.5 text-left rounded-lg transition-all duration-200
                      hover:bg-[#d6af53]/10 transform hover:translate-x-1
                      ${
                        activeComponent === item.key
                          ? "bg-[#d6af53]/20 text-[#d6af53] font-medium shadow-inner"
                          : "text-white/80 hover:text-[#d6af53]"
                      }
                    `}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          {/* Logout Button - Mobile Only */}
          <button
            onClick={handleLogout}
            className="md:hidden mx-3 mb-6 px-4 py-3 bg-[#d6af53]/10 text-[#d6af53] font-semibold rounded-lg 
              hover:bg-[#d6af53]/20 transition-all duration-300 flex items-center justify-center gap-2
              backdrop-blur-sm"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Fixed Header */}
        <header className="bg-gradient-to-br from-[#1a2a47] via-[#1a2a47] to-[#1a1a1a] sm:mx-3 sm:mt-3 sm:rounded-xl p-6 md:p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white transform hover:scale-105 transition-transform duration-300 uppercase">
              Dashboard
            </h2>
            {/* Logout Button - Desktop Only */}
            <button
              onClick={handleLogout}
              className="hidden md:flex px-5 py-2 bg-[#d6af53] text-white hover:text-[#d6af53] hover:font-bold font-semibold rounded-md shadow-md hover:bg-white hover:shadow-lg transform transition-all duration-300 items-center gap-2">
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="bg-transperent rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300 content-fade-in">
            <div className="p-6">{renderComponent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
