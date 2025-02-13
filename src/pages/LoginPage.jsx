import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({
        identifier: "",
        password: "",
    });

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/local`, data);
            console.log("this is response: ",response.data.jwt);
            toast.success('Login successful');
            if (response) {
                localStorage.setItem('token', response.data.jwt);
                navigate('/');
            }
        } catch (error) {
            console.error(error.response?.data?.message);
            toast.error("Login failed");
        }
    };

    return (
        <div className='mt-5'>
            <div className='bg-white w-full max-w-md  rounded overflow-hidden p-4 mx-auto'>
                <h3>Welcome to ConnectNow</h3>
                <form className='grid gap-4 mt-3' onSubmit={handleSubmit}>
                    <div className='flex flex-col gap-1'>
                        <label htmlFor='email'>Email :</label>
                        <input
                            type='text'
                            id='text'
                            name='identifier'
                            placeholder='enter your email'
                            className='bg-slate-100 px-2 py-1 focus:outline-primary'
                            value={data.identifier}
                            onChange={handleOnChange}
                            required
                        />
                        <label htmlFor='password'>Password :</label>
                        <input
                            type='password'
                            id='password'
                            name='password'
                            placeholder='enter your password'
                            className='bg-slate-100 px-2 py-1 focus:outline-primary'
                            value={data.password}
                            onChange={handleOnChange}
                            required
                        />
                    </div>
                    <button type="submit" className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800">Login</button>

                </form>
                <p className='my-3 text-center'>New User ? <Link to={"/register"} className='hover:text-primary font-semibold'>Register</Link></p>
                {/* <p className='my-3 text-center'><Link to={"/forgot-password"} className='hover:text-primary font-semibold'>Forgot password ?</Link></p> */}
            </div>
        </div>
    );
};

export default LoginPage;
