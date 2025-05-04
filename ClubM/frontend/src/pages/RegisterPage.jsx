import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';

const RegisterPage = () => {
    const { register, error } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const success = await register(name, email, password);
        setIsSubmitting(false);
        if (success) navigate('/');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow max-w-sm w-full space-y-4">
                <h2 className="text-2xl font-bold text-center mb-2">Register</h2>
                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded text-sm">
                        {error}
                    </div>
                )}
                <input
                    type="text"
                    placeholder="Name"
                    className="w-full border border-gray-200 rounded-lg p-2"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    disabled={isSubmitting}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border border-gray-200 rounded-lg p-2"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border border-gray-200 rounded-lg p-2"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    disabled={isSubmitting}
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-gray-900 text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Registering...' : 'Register'}
                </button>
                <div className="text-center text-sm mt-2">
                    Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
                </div>
            </form>
        </div>
    );
};

export default RegisterPage;