import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CheckCircle, Loader } from 'lucide-react';

const ContactUs = () => {
    const ip = import.meta.env.VITE_IP;
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState('');

    useEffect(() => {
        fetchQueries();
    }, []);

    const fetchQueries = async () => {
        try {
            const user_id = localStorage.getItem('userid');
            const response = await axios.post(`${ip}/moox_events/api/contactus/get-queries`, { user_id });
            setQueries(response.data.queries);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching queries:', error.message);
            setNotification('Failed to load queries.');
            setTimeout(() => setNotification(''), 2000);
            setLoading(false);
        }
    };

    const resolveQuery = async (event_id) => {
        try {
            const user_id = localStorage.getItem('userid');
            await axios.post(`${ip}/moox_events/api/contactus/change-query-status`, { event_id, user_id });
            setNotification('Query resolved successfully!');
            setTimeout(() => setNotification(''), 2000);
            fetchQueries();
        } catch (error) {
            console.error('Error resolving query:', error.message);
            setNotification('Failed to resolve query.');
            setTimeout(() => setNotification(''), 2000);
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
                        <h2 className="text-3xl font-bold text-white mb-2">Contact Us Queries</h2>
                        <p className="text-[#d6af53] font-medium">Manage and respond to customer inquiries</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader className="w-8 h-8 text-[#1a2a47] animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Latest Queries */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-[#1a2a47]">Latest Queries</h2>
                            {latestQueries.length ? (
                                latestQueries.map((query) => (
                                    <div
                                        key={query._id}
                                        className="bg-white rounded-2xl shadow-xl border border-[#d6af53]/10 overflow-hidden transform hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl hover:border-[#d6af53]/30 p-6"
                                    >
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-xl font-semibold text-[#1a2a47]">{query.name}</h3>
                                                <span className="px-3 py-1 bg-[#1a2a47]/10 text-[#1a2a47] rounded-full text-sm">
                                                    New
                                                </span>
                                            </div>
                                            <p className="text-[#1a2a47]/80">
                                                <span className="font-medium">Email:</span> {query.email}
                                            </p>
                                            <p className="text-[#1a2a47]/80">
                                                <span className="font-medium">Mobile:</span> {query.mobileno}
                                            </p>
                                            <p className="text-[#1a2a47]/80">
                                                <span className="font-medium">Purpose:</span> {query.purpose}
                                            </p>
                                            <p className="text-[#1a2a47]/60 text-sm">
                                                Received: {new Date(query.uploadedOn).toLocaleString()}
                                            </p>
                                            <button
                                                onClick={() => resolveQuery(query._id)}
                                                className="w-full bg-[#1a2a47] text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-[#d6af53] focus:outline-none focus:ring-2 focus:ring-[#d6af53] focus:ring-offset-2 transform transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle className="w-5 h-5" />
                                                Mark as Resolved
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-white rounded-2xl shadow-md p-6 text-center text-[#1a2a47]/60">
                                    No latest queries available.
                                </div>
                            )}
                        </div>

                        {/* Resolved Queries */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-[#1a2a47]">Resolved Queries</h2>
                            {resolvedQueries.length ? (
                                resolvedQueries.map((query) => (
                                    <div
                                        key={query._id}
                                        className="bg-white rounded-2xl shadow-xl border border-[#d6af53]/10 overflow-hidden p-6"
                                    >
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-xl font-semibold text-[#1a2a47]">{query.name}</h3>
                                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                                    Resolved
                                                </span>
                                            </div>
                                            <p className="text-[#1a2a47]/80">
                                                <span className="font-medium">Email:</span> {query.email}
                                            </p>
                                            <p className="text-[#1a2a47]/80">
                                                <span className="font-medium">Mobile:</span> {query.mobileno}
                                            </p>
                                            <p className="text-[#1a2a47]/80">
                                                <span className="font-medium">Purpose:</span> {query.purpose}
                                            </p>
                                            <p className="text-[#1a2a47]/60 text-sm">
                                                Received: {new Date(query.uploadedOn).toLocaleString()}
                                            </p>
                                            <p className="text-[#1a2a47]/60 text-sm">
                                                Resolved: {new Date(query.resolvedOn).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-white rounded-2xl shadow-md p-6 text-center text-[#1a2a47]/60">
                                    No resolved queries available.
                                </div>
                            )}
                        </div>
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

export default ContactUs;