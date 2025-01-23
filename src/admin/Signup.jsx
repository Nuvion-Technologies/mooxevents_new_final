import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import axios from "axios";
import { User, Phone, Mail, Calendar, Users, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

const Signup = () => {
    const ip = import.meta.env.VITE_IP;
    const [formData, setFormData] = useState({
        name: '',
        mobile_no: '',
        email: '',
        date_of_birth: '',
        gender: '',
        password: ''
    });
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRecaptchaChange = (token) => {
        setRecaptchaToken(token);
    };

    const handlePageChange = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        setIsLoading(true);

        if (!recaptchaToken) {
            setErrorMessage('Please complete the reCAPTCHA');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${ip}/moox_events/api/auth/add_admin`, {
                ...formData, recaptchaToken
            });
            setSuccessMessage(response.data.message);

            if (response.data.message === "Signup successful. Verify OTP sent to your email.") {
                localStorage.setItem('emailid', formData.email);
                window.location.href = '/admin/verify';
            } else {
                window.location.reload();
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Signup error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen sm:h-[50%] bg-[#FDF8DA] relative flex items-center justify-center p-4">
            {/* Logo */}
            <div className="absolute top-6 justify-center sm:top-8 sm:left-8">
                <img
                    src="/logo.png"
                    alt="Moox Events Logo"
                    className="h-24 sm:h-24 w-auto transform hover:scale-105 transition-transform duration-300"
                />
            </div>

            <div className="w-full max-w-2xl mx-auto mt-32 sm:mt-2">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#d6af53]/20">
                    {/* Header Section */}
                    <div className="px-8 pt-8 pb-6 bg-gradient-to-r from-[#1a2a47] to-[#1a1a1a] text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-[#d6af53]/10"></div>
                        <div className="relative">
                            <h2 className="text-3xl font-bold text-center mb-2">Create Account</h2>
                            <p className="text-[#d6af53] text-center font-medium">Join us today and get started</p>
                        </div>
                    </div>
                    
                    <div className="p-6 sm:px-8 py-6">
                        <form onSubmit={handleSignup} className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 sm:gap-y-4">
                            <div className="relative">
                                <label htmlFor="name" className="text-sm font-medium text-[#1a2a47] block mb-2">
                                    Full Name
                                </label>
                                <div className="relative group">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1a2a47]/40 group-hover:text-[#d6af53] transition-colors duration-200 h-5 w-5" />
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="pl-10 w-full px-4 py-3 border border-[#d6af53]/30 rounded-lg focus:border-transparent transition-all duration-200 bg-white/50 hover:bg-white"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <label htmlFor="mobile_no" className="text-sm font-medium text-[#1a2a47] block mb-2">
                                    Mobile Number
                                </label>
                                <div className="relative group">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1a2a47]/40 group-hover:text-[#d6af53] transition-colors duration-200 h-5 w-5" />
                                    <input
                                        type="text"
                                        name="mobile_no"
                                        id="mobile_no"
                                        value={formData.mobile_no}
                                        onChange={handleChange}
                                        required
                                        className="pl-10 w-full px-4 py-3 border border-[#d6af53]/30 rounded-lg  focus:border-transparent transition-all duration-200 bg-white/50 hover:bg-white"
                                        placeholder="Enter your mobile number"
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <label htmlFor="email" className="text-sm font-medium text-[#1a2a47] block mb-2">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1a2a47]/40 group-hover:text-[#d6af53] transition-colors duration-200 h-5 w-5" />
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="pl-10 w-full px-4 py-3 border border-[#d6af53]/30 rounded-lg  focus:border-transparent transition-all duration-200 bg-white/50 hover:bg-white"
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <label htmlFor="date_of_birth" className="text-sm font-medium text-[#1a2a47] block mb-2">
                                    Date of Birth
                                </label>
                                <div className="relative group">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1a2a47]/40 group-hover:text-[#d6af53] transition-colors duration-200 h-5 w-5" />
                                    <input
                                        type="date"
                                        name="date_of_birth"
                                        id="date_of_birth"
                                        value={formData.date_of_birth}
                                        onChange={handleChange}
                                        required
                                        className="pl-10 w-full px-4 py-3 border border-[#d6af53]/30 rounded-lg  focus:border-transparent transition-all duration-200 bg-white/50 hover:bg-white"
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <label htmlFor="gender" className="text-sm font-medium text-[#1a2a47] block mb-2">
                                    Gender
                                </label>
                                <div className="relative group">
                                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1a2a47]/40 group-hover:text-[#d6af53] transition-colors duration-200 h-5 w-5" />
                                    <select
                                        name="gender"
                                        id="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        required
                                        className="pl-10 w-full px-4 py-3 border border-[#d6af53]/30 rounded-lg  focus:border-transparent transition-all duration-200 bg-white/50 hover:bg-white appearance-none"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="relative">
                                <label htmlFor="password" className="text-sm font-medium text-[#1a2a47] block mb-2">
                                    Password
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1a2a47]/40 group-hover:text-[#d6af53] transition-colors duration-200 h-5 w-5" />
                                    <input
                                        type={passwordVisible ? "text" : "password"}
                                        name="password"
                                        id="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="pl-10 w-full px-4 py-3 border border-[#d6af53]/30 rounded-lg  focus:border-transparent transition-all duration-200 bg-white/50 hover:bg-white"
                                        placeholder="Create a password"
                                    />
                                    <div
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 "
                                        onClick={() => setPasswordVisible(!passwordVisible)}
                                    >
                                        {passwordVisible ? (
                                            <EyeOff className="text-[#1a2a47]/40 hover:text-[#d6af53] transition-colors duration-200" />
                                        ) : (
                                            <Eye className="text-[#1a2a47]/40 hover:text-[#d6af53] transition-colors duration-200" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="sm:col-span-2 flex justify-center transform scale-90 sm:scale-100 mt-2">
                                <ReCAPTCHA
                                    sitekey="6LfI7GoqAAAAANuq_7HftjCv1BumXG-61PS7h5Mh"
                                    onChange={handleRecaptchaChange}
                                />
                            </div>

                            <div className="sm:col-span-2 sm:mt-2">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-[#1a2a47] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#d6af53] focus:outline-none  focus:ring-offset-2 transform transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                                >
                                    {isLoading ? (
                                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            Create Account
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="sm:col-span-2 text-center">
                                <button
                                    type="button"
                                    onClick={handlePageChange}
                                    className="text-[#d6af53] text-sm font-medium hover:text-[#1a2a47] hover:underline transition duration-200"
                                >
                                    Already have an account? Sign In
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
