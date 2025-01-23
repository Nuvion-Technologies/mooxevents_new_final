import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Upload, CheckCircle, XCircle, Loader } from 'lucide-react';

const EventManagement = () => {
    const ip = import.meta.env.VITE_IP;
    const [events, setEvents] = useState([]);
    const [services, setServices] = useState([]);
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        event_date: '',
        event_type: '',
        photo: null,
    });
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [notification, setNotification] = useState('');
    const [previewImage, setPreviewImage] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchEvents = async () => {
        try {
            const user_id = localStorage.getItem('userid');
            if (!user_id) {
                setNotification('User not authenticated.');
                setTimeout(() => setNotification(''), 2000);
                return;
            }
            const { data } = await axios.post(`${ip}/moox_events/api/event/get-events`, { user_id });
            setEvents(data.events);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching events:', error);
            setNotification('Failed to load events.');
            setTimeout(() => setNotification(''), 2000);
            setLoading(false);
        }
    };

    const fetchServices = async () => {
        try {
            const { data } = await axios.get(`${ip}/moox_events/api/service/get-active-services`);
            setServices(data.services);
        } catch (error) {
            console.error('Error fetching services:', error);
            setNotification('Failed to load services.');
            setTimeout(() => setNotification(''), 2000);
        }
    };

    const handleAddEvent = async () => {
        try {
            const user_id = localStorage.getItem('userid');
            if (!user_id) {
                setNotification('User not authenticated.');
                setTimeout(() => setNotification(''), 2000);
                return;
            }
            const formData = { ...newEvent, user_id, photo: newEvent.photo.split(',')[1] };
            await axios.post(`${ip}/moox_events/api/event/add-event`, formData);
            fetchEvents();
            setIsFormVisible(false);
            setNewEvent({
                title: '',
                description: '',
                event_date: '',
                event_type: '',
                photo: null,
            });
            setPreviewImage(null);
            setNotification('Event added successfully!');
            setTimeout(() => setNotification(''), 2000);
        } catch (error) {
            console.error('Error adding event:', error);
            setNotification('Failed to add event.');
            setTimeout(() => setNotification(''), 2000);
        }
    };

    const handleToggleStatus = async (id, status) => {
        try {
            const user_id = localStorage.getItem('userid');
            if (!user_id) {
                setNotification('User not authenticated.');
                setTimeout(() => setNotification(''), 2000);
                return;
            }
            await axios.post(`${ip}/moox_events/api/event/change-event-status`, { event_id: id, status: !status, user_id });
            fetchEvents();
            setNotification(`Event ${status ? 'deactivated' : 'activated'} successfully!`);
            setTimeout(() => setNotification(''), 2000);
        } catch (error) {
            console.error('Error toggling event status:', error);
            setNotification('Failed to update event status.');
            setTimeout(() => setNotification(''), 2000);
        }
    };

    useEffect(() => {
        fetchEvents();
        fetchServices();
    }, []);

    return (
        <div className="min-h-screen bg-[#FDF8DA] p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-[#1a2a47] rounded-2xl p-6 mb-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#d6af53]/10"></div>
                    <div className="relative">
                        <h2 className="text-3xl font-bold text-white mb-2">Event Management</h2>
                        <p className="text-[#d6af53] font-medium">Create and manage your events</p>
                    </div>
                </div>

                {/* Toggle Form Button */}
                <button
                    onClick={() => setIsFormVisible(!isFormVisible)}
                    className="mb-8 bg-[#1a2a47] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#d6af53] focus:outline-none focus:ring-2 focus:ring-[#d6af53] focus:ring-offset-2 transform transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                    <Plus className="w-5 h-5" />
                    {isFormVisible ? 'Hide Form' : 'Add New Event'}
                </button>

                {/* Add New Event Form */}
                {isFormVisible && (
                    <div className="bg-white rounded-2xl shadow-xl border border-[#d6af53]/20 overflow-hidden mb-8">
                        <div className="p-6 sm:p-8">
                            <h3 className="text-xl font-semibold text-[#1a2a47] mb-6">Add New Event</h3>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-[#1a2a47] mb-2">Event Title</label>
                                        <input
                                            type="text"
                                            value={newEvent.title}
                                            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                            className="w-full px-4 py-3 border border-[#d6af53]/30 rounded-lg focus:ring-2 focus:ring-[#d6af53] focus:border-transparent transition-all duration-200 bg-white/50 hover:bg-white"
                                            placeholder="Enter event title"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#1a2a47] mb-2">Event Date</label>
                                        <input
                                            type="date"
                                            value={newEvent.event_date}
                                            onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })}
                                            className="w-full px-4 py-3 border border-[#d6af53]/30 rounded-lg focus:ring-2 focus:ring-[#d6af53] focus:border-transparent transition-all duration-200 bg-white/50 hover:bg-white"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-[#1a2a47] mb-2">Description</label>
                                        <textarea
                                            value={newEvent.description}
                                            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                            rows="4"
                                            className="w-full px-4 py-3 border border-[#d6af53]/30 rounded-lg focus:ring-2 focus:ring-[#d6af53] focus:border-transparent transition-all duration-200 bg-white/50 hover:bg-white"
                                            placeholder="Enter event description"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#1a2a47] mb-2">Service Type</label>
                                        <select
                                            value={newEvent.event_type}
                                            onChange={(e) => setNewEvent({ ...newEvent, event_type: e.target.value })}
                                            className="w-full px-4 py-3 border border-[#d6af53]/30 rounded-lg focus:ring-2 focus:ring-[#d6af53] focus:border-transparent transition-all duration-200 bg-white/50 hover:bg-white"
                                        >
                                            <option value="">Select Service</option>
                                            {services.map((service) => (
                                                <option key={service._id} value={service._id}>
                                                    {service.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#1a2a47] mb-2">Event Photo</label>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const reader = new FileReader();
                                                    reader.onload = () => {
                                                        setNewEvent({ ...newEvent, photo: reader.result });
                                                        setPreviewImage(reader.result);
                                                    };
                                                    reader.readAsDataURL(e.target.files[0]);
                                                }}
                                                className="hidden"
                                                id="event-photo"
                                            />
                                            <label
                                                htmlFor="event-photo"
                                                className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-[#d6af53]/30 rounded-lg  hover:border-[#d6af53] transition-all duration-200"
                                            >
                                                {previewImage ? (
                                                    <div className="relative w-full aspect-video">
                                                        <img
                                                            src={previewImage}
                                                            alt="Preview"
                                                            className="w-full h-full object-cover rounded-lg"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center py-4">
                                                        <Upload className="w-8 h-8 text-[#d6af53] mb-2" />
                                                        <span className="text-sm text-gray-600">Click to upload photo</span>
                                                    </div>
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleAddEvent}
                                    className="w-full bg-[#1a2a47] text-white py-3.5 px-4 rounded-lg font-semibold hover:bg-[#d6af53] focus:outline-none focus:ring-2 focus:ring-[#d6af53] focus:ring-offset-2 transform transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                                >
                                    <Plus className="w-5 h-5" />
                                    Add Event
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Events Grid */}
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                    <Loader className="w-8 h-8 text-[#1a2a47] animate-spin" />
                </div>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => (
                        <div
                            key={event._id}
                            className="group relative h-[400px] bg-white rounded-2xl shadow-xl border border-[#d6af53]/10 overflow-hidden transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl hover:border-[#d6af53]/30"
                        >
                            {/* Full-size image with gradient overlay */}
                            <img
                                src={event.photo}
                                alt={event.title}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                            {/* Status Badge */}
                            <div
                                className={`absolute top-4 right-4 px-4 py-1.5 rounded-full text-sm font-medium shadow-lg backdrop-blur-sm ${
                                    event.active
                                        ? 'bg-green-500/90 text-white'
                                        : 'bg-red-500/90 text-white'
                                }`}
                            >
                                {event.active ? 'Active' : 'Inactive'}
                            </div>

                            {/* Event Info */}
                            <div className="absolute bottom-20 left-6">
                                <h3 className="text-2xl font-bold text-white drop-shadow-lg mb-2">
                                    {event.title}
                                </h3>
                                <p className="text-white/90 text-sm mb-2">
                                    {new Date(event.event_date).toLocaleDateString()}
                                </p>
                                <p className="text-white/80 line-clamp-2 text-sm">
                                    {event.description}
                                </p>
                            </div>

                            {/* Action Button */}
                            <div className="absolute bottom-6 right-6">
                                <button
                                    onClick={() => handleToggleStatus(event._id, event.active)}
                                    className={`flex items-center gap-2 px-4 h-10 rounded-full transition-all duration-300 ${
                                        event.active
                                            ? 'bg-[#1a2a47]/80 text-white hover:bg-[#d6af53]'
                                            : 'bg-[#d6af53]/80 text-white hover:bg-[#1a2a47]'
                                    }`}
                                >
                                    {event.active ? (
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
        </div>
    );
};

export default EventManagement;