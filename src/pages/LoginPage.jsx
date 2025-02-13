import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaLock } from "react-icons/fa";

const LoginPage = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({
        identifier: "",
        password: "",
    });

    const [errors, setErrors] = useState({}); // For real-time validation

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
        if (!data.identifier || !data.password) {
            setErrors({
                identifier: data.identifier ? "" : "Email is required",
                password: data.password ? "" : "Password is required"
            });
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/local`, data);
            toast.success('Login successful');

            if (response) {
                localStorage.setItem('token', response.data.jwt);
                localStorage.setItem('username', response.data.user.username);
                navigate('/');
            }
        } catch (error) {
            console.error(error.response?.data?.message);
            toast.error("Invalid email or password");
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100 items-center justify-center">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-center mb-4">
                    <FaLock className="text-blue-600 text-3xl" />
                </div>
                <h3 className="text-2xl font-semibold text-center text-gray-800">Welcome to ConnectNow</h3>
                <p className="text-center text-gray-500 mb-4">Securely log in to continue</p>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* Email Field */}
                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-gray-700 font-medium">Email</label>
                        <input
                            type="text"
                            id="identifier"
                            name="identifier"
                            placeholder="Enter your email"
                            className="border p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={data.identifier}
                            onChange={handleOnChange}
                        />
                        {errors.identifier && <p className="text-red-500 text-sm">{errors.identifier}</p>}
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
                        Login
                    </button>
                </form>

                {/* Register Link */}
                <p className="text-center text-gray-600 mt-4">
                    New User? <Link to="/register" className="text-blue-600 font-semibold hover:underline">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
