import React from 'react';
import { Target, Compass } from 'lucide-react';

const VisionMission = () => {
  return (
    <div className="w-full py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Vision */}
          <div 
            className="group bg-gray-50 p-8 rounded-lg shadow-lg transition-all duration-500 hover:shadow-2xl"
            data-aos="fade-right"
            data-aos-duration="1000"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-[#DBAF76] rounded-full transform transition-transform duration-500 group-hover:scale-110">
                <Target className="w-8 h-8 text-white animate-pulse" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-center mb-4 text-gray-800 group-hover:text-[#DBAF76] transition-colors duration-300">
              Our Vision
            </h2>
            <p className="text-gray-600 text-center transform transition-all duration-500 group-hover:scale-105">
              To become the leading event management company in India, known for creating extraordinary experiences that exceed expectations.
            </p>
          </div>

          {/* Mission */}
          <div 
            className="group bg-gray-50 p-8 rounded-lg shadow-lg transition-all duration-500 hover:shadow-2xl"
            data-aos="fade-left"
            data-aos-duration="1000"
            data-aos-delay="200"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-[#DBAF76] rounded-full transform transition-transform duration-500 group-hover:scale-110">
                <Compass className="w-8 h-8 text-white animate-pulse" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-center mb-4 text-gray-800 group-hover:text-[#DBAF76] transition-colors duration-300">
              Our Mission
            </h2>
            <p className="text-gray-600 text-center transform transition-all duration-500 group-hover:scale-105">
              To deliver exceptional event experiences by combining creativity, precision, and personalized service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisionMission;