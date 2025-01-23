import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MessageSquare, CheckCircle, Send, Mail, Phone, User, FileText, Loader } from 'lucide-react';

const Enquiry = () => {
    const ip = import.meta.env.VITE_IP;
    const [queries, setQueries] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newQuery, setNewQuery] = useState({
        name: '',
        mobileno: '',
        email: '',
        purpose_id: '',
        purpose_name: '',
        message: ''
    });

    useEffect(() => {
        fetchQueries();
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const { data } = await axios.get(`${ip}/moox_events/api/service/get-active-services`);
            setServices(data.services);
        } catch (error) {
            console.error('Error fetching services:', error.message);
        }
    };

    const fetchQueries = async () => {
        try {
            setLoading(true);
            const user_id = localStorage.getItem('userid');
            const response = await axios.post(`${ip}/moox_events/api/enquiry/get-enquiry`, { user_id });
            setQueries(response.data.queries);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching queries:', error.message);
            setLoading(false);
        }
    };

    const resolveQuery = async (query_id) => {
        try {
            const user_id = localStorage.getItem('userid');
            await axios.post(`${ip}/moox_events/api/enquiry/change-enquiry-status`, { event_id: query_id, user_id });
            alert('Query resolved successfully!');
            fetchQueries();
        } catch (error) {
            console.error('Error resolving query:', error.message);
            alert('Failed to resolve query.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewQuery((prev) => ({ ...prev, [name]: value }));
    };

    const handlePurposeChange = (e) => {
        const { value } = e.target;
        const selectedService = services.find(service => service._id === value);
        setNewQuery(prev => ({
            ...prev,
            purpose_id: value,
            purpose_name: selectedService ? selectedService.name : ''
        }));
    };

    const handleSubmitQuery = async (e) => {
        e.preventDefault();
        try {
            const { name, mobileno, email, purpose_id, purpose_name, message } = newQuery;
            const user_id = localStorage.getItem('userid');
            await axios.post(`${ip}/moox_events/api/enquiry/add-enquiry`, { name, mobileno, email, purpose_id, purpose_name, message, user_id });
            alert('Query submitted successfully');
            setNewQuery({
                name: '',
                mobileno: '',
                email: '',
                purpose_id: '',
                purpose_name: '',
                message: ''
            });
            fetchQueries();
        } catch (error) {
            console.error('Error submitting query:', error.message);
            alert('Failed to submit query.');
        }
    };

    const latestQueries = queries.filter((query) => query.active).sort((a, b) => new Date(b.uploadedOn) - new Date(a.uploadedOn));
    const resolvedQueries = queries.filter((query) => !query.active).sort((a, b) => new Date(b.uploadedOn) - new Date(a.uploadedOn));

    return (
        <div className="min-h-screen bg-[#FDF8DA] p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-[#1a2a47] rounded-2xl p-6 mb-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#d6af53]/10"></div>
                    <div className="relative">
                        <h2 className="text-3xl font-bold text-white mb-2">
                            Contact Us Queries
                        </h2>
                        <p className="text-[#d6af53] font-medium">
                            Manage and respond to customer inquiries
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                    <Loader className="w-8 h-8 text-[#1a2a47] animate-spin" />
                </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Latest Queries */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-[#1a2a47]">Latest Queries</h2>
                            {latestQueries.length ? (
                                latestQueries.map((query) => (
                                    <div key={query._id} className="bg-white rounded-2xl shadow-xl border border-[#d6af53]/20 overflow-hidden">
                                        <div className="p-6">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-5 h-5 text-[#d6af53]" />
                                                    <p className="font-semibold text-[#1a2a47]">{query.name}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-5 h-5 text-[#d6af53]" />
                                                    <p>{query.email}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-5 h-5 text-[#d6af53]" />
                                                    <p>{query.mobileno}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <FileText className="w-5 h-5 text-[#d6af53]" />
                                                    <p>{query.purpose_name}</p>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <MessageSquare className="w-5 h-5 text-[#d6af53] mt-1" />
                                                    <p className="flex-1">{query.message}</p>
                                                </div>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(query.uploadedOn).toLocaleString()}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => resolveQuery(query._id)}
                                                className="mt-4 w-full bg-[#1a2a47] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#d6af53] focus:outline-none focus:ring-2 focus:ring-[#d6af53] focus:ring-offset-2 transform transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle className="w-5 h-5" />
                                                Mark as Resolved
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No latest queries available.</p>
                            )}
                        </div>

                        {/* Resolved Queries */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-[#1a2a47]">Resolved Queries</h2>
                            {resolvedQueries.length ? (
                                resolvedQueries.map((query) => (
                                    <div key={query._id} className="bg-white rounded-2xl shadow-xl border border-[#d6af53]/20 overflow-hidden opacity-75">
                                        <div className="p-6">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-5 h-5 text-[#d6af53]" />
                                                    <p className="font-semibold text-[#1a2a47]">{query.name}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-5 h-5 text-[#d6af53]" />
                                                    <p>{query.email}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-5 h-5 text-[#d6af53]" />
                                                    <p>{query.mobileno}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <FileText className="w-5 h-5 text-[#d6af53]" />
                                                    <p>{query.purpose_name}</p>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <MessageSquare className="w-5 h-5 text-[#d6af53] mt-1" />
                                                    <p className="flex-1">{query.message}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm text-gray-500">
                                                        Submitted: {new Date(query.uploadedOn).toLocaleString()}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Resolved: {new Date(query.resolvedOn).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 text-green-600">
                                                    <CheckCircle className="w-5 h-5" />
                                                    <span className="font-semibold">Resolved</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No resolved queries available.</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Submit Query Form */}
                <div className="mt-5 bg-white rounded-2xl shadow-xl border border-[#d6af53]/20 overflow-hidden">
                    <div className="p-6 sm:p-8">
                        <h3 className="text-xl font-semibold text-[#1a2a47] mb-6">Submit a Query</h3>
                        <form onSubmit={handleSubmitQuery} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-[#1a2a47] mb-2">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={newQuery.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-[#d6af53]/30 rounded-lg focus:ring-2 focus:ring-[#d6af53] focus:border-transparent transition-all duration-200 bg-white/50 hover:bg-white"
                                        placeholder="Enter your name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#1a2a47] mb-2">
                                        Mobile Number
                                    </label>
                                    <input
                                        type="text"
                                        name="mobileno"
                                        value={newQuery.mobileno}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-[#d6af53]/30 rounded-lg focus:ring-2 focus:ring-[#d6af53] focus:border-transparent transition-all duration-200 bg-white/50 hover:bg-white"
                                        placeholder="Enter your mobile number"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#1a2a47] mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={newQuery.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-[#d6af53]/30 rounded-lg focus:ring-2 focus:ring-[#d6af53] focus:border-transparent transition-all duration-200 bg-white/50 hover:bg-white"
                                        placeholder="Enter your email"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#1a2a47] mb-2">
                                        Purpose
                                    </label>
                                    <select
                                        name="purpose_id"
                                        value={newQuery.purpose_id}
                                        onChange={handlePurposeChange}
                                        required
                                        className="w-full px-4 py-3 border border-[#d6af53]/30 rounded-lg focus:ring-2 focus:ring-[#d6af53] focus:border-transparent transition-all duration-200 bg-white/50 hover:bg-white"
                                    >
                                        <option value="">Select Purpose</option>
                                        {services.map((service) => (
                                            <option key={service._id} value={service._id}>
                                                {service.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-[#1a2a47] mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        name="message"
                                        value={newQuery.message}
                                        onChange={handleInputChange}
                                        required
                                        rows="4"
                                        className="w-full px-4 py-3 border border-[#d6af53]/30 rounded-lg focus:ring-2 focus:ring-[#d6af53] focus:border-transparent transition-all duration-200 bg-white/50 hover:bg-white"
                                        placeholder="Enter your message"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#1a2a47] text-white py-3.5 px-4 rounded-lg font-semibold hover:bg-[#d6af53] focus:outline-none focus:ring-2 focus:ring-[#d6af53] focus:ring-offset-2 transform transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                            >
                                <Send className="w-5 h-5" />
                                Submit Query
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Enquiry;