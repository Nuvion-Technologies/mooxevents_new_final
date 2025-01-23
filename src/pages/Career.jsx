import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Menu from '../components/Menu';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Loader from '../components/Loader';
import axios from 'axios';

const Career = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const [positions, setPositions] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [popupData, setPopupData] = useState({ 
    name: '', 
    email: '', 
    mobileno: '',
    countryCode: '+91'
  });
  const ip = import.meta.env.VITE_IP;

  useEffect(() => {
    if (!showLoader) {
      AOS.init({ duration: 1000, once: true });
      AOS.refresh();
    }
  }, [showLoader]);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await axios.post(`${ip}/moox_events/api/career/jobs`);
        const data = response.data;

        //console.log('API Response:', data);

        const positionsArray = data.events;

        if (Array.isArray(positionsArray)) {
          const formattedPositions = positionsArray.map(position => ({
            ...position,
            requirements: position.requirements.split(',').map(req => req.trim())
          }));
          setPositions(formattedPositions);
        } else {
          console.error('Expected an array of positions, but received:', positionsArray);
        }
      } catch (error) {
        console.error('Error fetching positions:', error);
      } finally {
        setTimeout(() => setIsLoading(false), 1000);
        setTimeout(() => setShowLoader(false), 1000);
      }
    };

    fetchPositions();
  }, []);

  const handleApplyNow = (positionId) => {
    const position = positions.find(p => p._id === positionId);
    setSelectedPosition(position);
  };

  const handleCCChange = (e) => {
    const value = e.target.value;
  
    if (value === "+" || /^\+\d*$/.test(value)) {
      setPopupData(prevData => ({
        ...prevData,
        countryCode: value || "+91",
      }));
    }
  };

  const handleSubmitApplication = async () => {
    if (!popupData.name || !popupData.email || !popupData.mobileno) {
      alert('Please fill in all the fields');
      return;
    }

    const applicationData = {
      ...popupData,
      position_id: selectedPosition._id,
      mobileno: `${popupData.countryCode} ${popupData.mobileno}`
    };

    try {
      const response = await fetch(`${ip}/moox_events/api/career/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });
      const result = await response.json();
      
      // Set success message and close popup after delay
      setSuccessMessage(result.message || 'Application submitted successfully!');
      setSelectedPosition(null);
      setPopupData({ name: '', email: '', mobileno: '', countryCode: '+91' });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      alert('There was an error submitting your application.');
    }
  };

  return (
    <>
      {showLoader && (
        <div className={`fixed w-full h-screen flex justify-center items-center bg-black z-[999] transition-opacity duration-1000 ${isLoading ? 'opacity-100' : 'opacity-0'}`}>
          <Loader />
        </div>
      )}
      <Menu />
      <div className="min-h-screen flex flex-col font-parkin bg-gray-100">
        {/* Success Message */}
        {successMessage && (
          <div className="fixed bottom-10 right-10 bg-green-500 text-white p-4 rounded-lg shadow-lg z-[9999] animate-fade-in-out">
            <p>{successMessage}</p>
          </div>
        )}

        {/* Header Section */}
        <div className="bg-gray-900 h-96 text-white text-center py-16 flex items-center justify-center flex-col px-4" data-aos="fade-down" data-aos-duration="1500">
          <h1 className="text-4xl md:text-5xl font-bold text-white font-parkin">Career at Moox Events</h1>
          <p className="text-lg md:text-xl mt-2 opacity-0 animate-fadeIn">Join our team and be a part of something special</p>
        </div>

        {/* Breadcrumb Section */}
        <nav className="bg-[#DBAF76] py-3 px-4 md:py-4 md:px-6" data-aos="fade-down" data-aos-duration="1500">
          <ol className="flex flex-wrap space-x-2 md:space-x-4 text-sm md:text-base text-white">
            <li>
              <a href="/" className="hover:text-[#785322]">Home</a>
            </li>
            <li>/</li>
            <li>
              <a href="/career" className="hover:text-[#785322]">Careers</a>
            </li>
          </ol>
        </nav>

        {/* Why Choose Moox Events Section */}
        <section className="px-6 py-12 md:px-8 md:py-16 bg-white" data-aos="fade-up" data-aos-duration="1500">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-semibold text-[#283B5C] mb-6">Why Choose Moox Events?</h2>
            <p className="text-lg text-gray-700">
              At Moox Events, we believe in creating unforgettable experiences. Our team is passionate about delivering high-quality events that make an impact. We offer a dynamic and supportive work environment where innovation is encouraged and creativity is celebrated. Join us and contribute to bringing exceptional events to life.
            </p>
          </div>
        </section>

        {/* Open Positions Section */}
        <section className="px-6 py-12 md:px-8 md:py-16 bg-white" data-aos="fade-up" data-aos-duration="1500">
          <h2 className="text-3xl font-semibold text-center mb-8">
            Open Positions at <span className="text-[#DBAF76]">Moox Events</span>
          </h2>
          {positions.length > 0 ? (
            <div className="space-y-8">
              {positions.map((position, index) => (
                <div
                  key={position._id}
                  className="bg-white shadow-lg rounded-lg p-8 md:p-10 transition-all hover:shadow-xl transform duration-300 ease-in-out w-[70%] md:w-[60%] mx-auto"
                  onClick={() => handleApplyNow(position._id)}
                >
                  <h3 className="text-2xl font-semibold text-[#283B5C] mb-4">{position.position_name}</h3>
                  <p className="text-base text-gray-600 mb-4">{position.description}</p>
                  <p className="text-sm text-gray-500 mb-2"><strong>Requirements:</strong></p>
                  <ul className="list-disc pl-5 text-gray-500 mb-4">
                    {position.requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                  <p className="text-sm text-gray-500 mb-4"><strong>Location:</strong> {position.location}</p>
                  <a
                    href="#"
                    className="inline-block py-3 px-6 bg-[#283B5C] text-white font-semibold rounded-md transition duration-300 hover:bg-[#DBAF76]"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApplyNow(position._id);
                    }}
                  >
                    Apply Now
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-lg text-gray-200">No open positions available at the moment. Check back soon!</p>
          )}
        </section>

        {/* Apply Now Popup */}
        {selectedPosition && (
          <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-[9999]">
            <div className="bg-white p-8 rounded-lg w-[90%] max-w-md">
              <h3 className="text-2xl font-semibold mb-4">Apply for {selectedPosition.position_name}</h3>
              <form onSubmit={(e) => { e.preventDefault(); handleSubmitApplication(); }}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-semibold">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={popupData.name}
                    onChange={(e) => setPopupData({ ...popupData, name: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-semibold">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={popupData.email}
                    onChange={(e) => setPopupData({ ...popupData, email: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="mobileno" className="block text-sm font-semibold">Mobile Number</label>
                  <div className="flex gap-0.5">
                    {/* Country Code Input */}
                    <input
                      type="text"
                      id="countryCode"
                      name="countryCode"
                      value={popupData.countryCode}
                      onChange={handleCCChange}
                      className="px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#DBAF76] w-[100px]"
                      maxLength={5}
                      placeholder="+"
                      pattern="\+\d*"
                      title="Please enter a valid country code (e.g., +91)"
                    />

                    {/* Mobile Number Input */}
                    <input
                      type="text"
                      id="mobileno"
                      value={popupData.mobileno}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        if (value.length <= 10) {
                          setPopupData({ ...popupData, mobileno: value });
                        }
                      }}
                      className="w-full p-2 border border-gray-300 rounded-r-md"
                      placeholder="Your Mobile Number"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 px-6 bg-[#283B5C] text-white font-semibold rounded-md transition duration-300 hover:bg-[#DBAF76]"
                >
                  Submit Application
                </button>
              </form>
              <button
                onClick={() => setSelectedPosition(null)}
                className="w-full py-3 px-6 bg-red-400 mt-3 text-white font-semibold rounded-md transition duration-300 hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </>
  );
};

export default Career;