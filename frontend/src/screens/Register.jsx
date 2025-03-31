import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/user.context';
import axios from '../config/axios';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const { data } = await axios.post('/users/register', { email, password });
            localStorage.setItem('token', data.token);
            setUser(data.user);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 animate-gradient">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-500 hover:shadow-3xl hover:scale-[1.005]">
                <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-300 mb-8 text-center animate-fade-in">
                    Create Account
                </h2>

                <form onSubmit={submitHandler} className="space-y-6">
                    {error && (
                        <div className="animate-shake bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-300"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-5 border border-white border-opacity-20 focus:outline-none focus:border-opacity-40 focus:bg-opacity-10 text-gray-100 placeholder-gray-300 transition-all duration-300"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-300"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-5 border border-white border-opacity-20 focus:outline-none focus:border-opacity-40 focus:bg-opacity-10 text-gray-100 placeholder-gray-300 transition-all duration-300"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.01] shadow-lg hover:shadow-xl flex items-center justify-center disabled:opacity-70"
                    >
                        {isLoading ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        ) : (
                            'Sign Up'
                        )}
                    </button>
                </form>

                <p className="text-center mt-6 text-gray-300">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="text-blue-300 hover:text-blue-400 font-semibold underline-animation"
                    >
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;