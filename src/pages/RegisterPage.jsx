import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaUserPlus } from "react-icons/fa";

const RegisterPage = () => {
    const [data, setData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({
            ...prev,
            [name]: value
        }));

        // Real-time Validation
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: value.trim() === "" ? "This field is required" : ""
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic Validation
        if (!data.username || !data.email || !data.password) {
            setErrors({
                username: data.username ? "" : "Name is required",
                email: data.email ? "" : "Email is required",
                password: data.password ? "" : "Password is required"
            });
            return;
        }

        const URL = `${import.meta.env.VITE_BACKEND_URL}/auth/local/register`;

        try {
            const response = await axios.post(URL, data);
            toast.success("Registration successful! Redirecting...");

            setData({ username: "", email: "", password: "" });

            setTimeout(() => navigate('/login'), 1500);
        } catch (error) {
            toast.error("Something went wrong, try again.");
            console.error(error?.message);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100 items-center justify-center">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-center mb-4">
                    <FaUserPlus className="text-blue-600 text-3xl" />
                </div>
                <h3 className="text-2xl font-semibold text-center text-gray-800">Join ConnectNow</h3>
                <p className="text-center text-gray-500 mb-4">Create an account to get started</p>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* Name Field */}
                    <div className="flex flex-col">
                        <label htmlFor="username" className="text-gray-700 font-medium">Name</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Enter your name"
                            className="border p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={data.username}
                            onChange={handleOnChange}
                        />
                        {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
                    </div>

                    {/* Email Field */}
                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-gray-700 font-medium">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            className="border p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={data.email}
                            onChange={handleOnChange}
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>

                    {/* Password Field */}
                    <div className="flex flex-col">
                        <label htmlFor="password" className="text-gray-700 font-medium">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            className="border p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={data.password}
                            onChange={handleOnChange}
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition"
                    >
                        Register
                    </button>
                </form>

                {/* Login Link */}
                <p className="text-center text-gray-600 mt-4">
                    Already have an account? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
