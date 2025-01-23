import React, { useEffect, useState } from "react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import PropTypes from "prop-types";
import AOS from "aos";
import axios from 'axios';
import "aos/dist/aos.css";

const TeamMemberItem = ({ member }) => (
  <div
    className="group relative shadow-xl rounded-xl h-full p-2 bg-gray-50 overflow-hidden transition-transform duration-500 transform hover:scale-105 "
    data-aos="fade-up"
    data-aos-duration="1000"
    data-aos-delay="200"
  >
    {/* Card Image */}
    <div className="relative overflow-hidden rounded-lg h-[300px]">
      <img
        src={member.photo}
        alt={member.name}
        className="w-full h-full transition-transform duration-700 transform group-hover:scale-150"
      />
    </div>

    {/* Card Content */}
    <div className="px-4 py-6">
      <h4
        className="text-2xl font-medium mb-1"
        data-aos="zoom-in"
        data-aos-duration="1000"
        data-aos-delay="300"
      >
        {member.name}
      </h4>
      <p
        className="mb-4 text-sm"
        data-aos="fade-right"
        data-aos-duration="1000"
        data-aos-delay="400"
      >
        {member.position}
      </p>
      <p className="opacity-50 mb-0" data-aos="fade-left" data-aos-duration="1000" data-aos-delay="500">
        {member.description}
      </p>
      <div className="mt-6" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="600">
        {member.facebook_link && (
          <a
          href={`https://www.facebook.com/${member.facebook_link}`}
            className="inline-block opacity-60 transition duration-300 hover:translate-y-1 hover:opacity-100 mr-4"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebookF className="text-xl" />
          </a>
        )}
        {member.instagram_link && (
          <a
            href={`https://www.instagram.com/${member.instagram_link}`}
            className="inline-block opacity-60 transition duration-300 hover:translate-y-1 hover:opacity-100 mr-4"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram className="text-xl" />
          </a>
        )}
      </div>
    </div>
  </div>
);

TeamMemberItem.propTypes = {
  member: PropTypes.object.isRequired,
};

const TeamHome = () => {
  const [members, setMembers] = useState([]);
  const ip = import.meta.env.VITE_IP;

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    const fetchActiveMembers = async () => {
      try {
        const response = await axios.post(`${ip}/moox_events/api/team/get-active-members`);
        setMembers(response.data.events);
      } catch (error) {
        console.error('Error fetching active members:', error);
      }
    };

    fetchActiveMembers();
  }, [ip]);

  return (
    <section className="ezy__team4 light py-14 md:py-16">
      <div className="container px-4 mx-auto ">
        <div className="grid grid-cols-4 gap-6 text-center">
          {members.map((member, i) => (
            <div
              className="col-span-4 md:col-span-2 lg:col-span-1"
              key={member.id}
              data-aos="flip-left"
              data-aos-duration="1000"
              data-aos-delay={`${i * 100}`}
            >
              <TeamMemberItem member={member} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamHome;