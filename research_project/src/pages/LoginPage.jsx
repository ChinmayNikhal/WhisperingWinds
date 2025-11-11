import React, { useState } from 'react';
import { initialProfileState } from '../utils/AQILogic';
import { ArrowRight } from 'lucide-react';

// --- Auth Components ---

const LoginForm = ({ setView, setUser, setLoggedIn, switchToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        
        // --- MOCK AUTHENTICATION LOGIC ---
        // In a real app, this would be an API call to Firebase/Backend.
        // For demonstration, we'll just check if fields are filled.
        if (!email.trim() || !password.trim()) {
            setError('Please enter both email and password.');
            return;
        }

        // Simulate successful login
        const mockUser = {
            username: email.split('@')[0], // Use email prefix as username mock
            age: 35, // Mock age
            hasAsthma: false, // Mock health status
        };

        const sensitivity = mockUser.hasAsthma || mockUser.age >= 65
            ? 'High (Asthma/Age)'
            : 'Low (General Population)';

        setUser({
            ...initialProfileState,
            ...mockUser,
            sensitivity: sensitivity,
            isLoggedIn: true,
        });
        setLoggedIn(true);
        setView('dashboard');
    };

    return (
        <div className="w-full max-w-md p-8 bg-gray-800 rounded-xl shadow-2xl border border-indigo-700/50">
            <h2 className="text-3xl font-bold text-center text-indigo-400 mb-6">Account Login</h2>
            <p className="text-gray-400 text-center mb-8">Sign in to get personalized AQI recommendations.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <input
                    type="email"
                    placeholder="Email (e.g., user@gmail.com)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
                />

                {error && (
                    <div className="text-sm text-red-400 bg-red-900/30 p-2 rounded-lg">{error}</div>
                )}

                <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors duration-300 shadow-lg"
                >
                    Login
                </button>
            </form>

            <div className="mt-6 text-center">
                <button 
                    onClick={switchToRegister}
                    className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors flex items-center justify-center w-full group"
                >
                    Don't have an account? Register
                    <ArrowRight className="w-4 h-4 ml-1 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

const RegisterForm = ({ setView, setUser, setLoggedIn, switchToLogin }) => {
    const [details, setDetails] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        age: 30,
        hasAsthma: false,
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setDetails(p => ({
            ...p,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (details.password !== details.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (!details.username.trim() || details.age < 1) {
            setError('Please fill out all required fields correctly.');
            return;
        }

        // --- MOCK REGISTRATION & LOGIN ---
        const sensitivity = details.hasAsthma || details.age >= 65
            ? 'High (Asthma/Age)'
            : 'Low (General Population)';

        setUser({
            ...initialProfileState,
            username: details.username,
            age: details.age,
            hasAsthma: details.hasAsthma,
            sensitivity: sensitivity,
            isLoggedIn: true,
        });
        setLoggedIn(true);
        setView('dashboard');
    };

    return (
        <div className="w-full max-w-md p-8 bg-gray-800 rounded-xl shadow-2xl border border-indigo-700/50">
            <h2 className="text-3xl font-bold text-center text-indigo-400 mb-6">Create Account</h2>
            <p className="text-gray-400 text-center mb-8">Set up your profile for personalized AQI assessment.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="email" name="email" placeholder="Email (Used for login)" value={details.email} onChange={handleChange} required className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400" />
                <input type="text" name="username" placeholder="Username" value={details.username} onChange={handleChange} required className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400" />
                <input type="password" name="password" placeholder="Password" value={details.password} onChange={handleChange} required className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400" />
                <input type="password" name="confirmPassword" placeholder="Confirm Password" value={details.confirmPassword} onChange={handleChange} required className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400" />
                
                <input
                    type="number"
                    name="age"
                    placeholder="Age"
                    value={details.age}
                    onChange={handleChange}
                    min="1"
                    max="120"
                    required
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                />

                <div className="flex items-center justify-between bg-gray-700 p-3 rounded-lg border border-gray-600">
                    <label htmlFor="reg-asthma" className="text-white font-medium">Do you have Asthma/Health Issues?</label>
                    <input
                        type="checkbox"
                        id="reg-asthma"
                        name="hasAsthma"
                        checked={details.hasAsthma}
                        onChange={handleChange}
                        className="h-5 w-5 text-indigo-500 border-gray-300 rounded focus:ring-indigo-500"
                    />
                </div>

                {error && (
                    <div className="text-sm text-red-400 bg-red-900/30 p-2 rounded-lg">{error}</div>
                )}

                <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors duration-300 shadow-lg"
                >
                    Register and Login
                </button>
            </form>

            <div className="mt-6 text-center">
                <button 
                    onClick={switchToLogin}
                    className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors flex items-center justify-center w-full group"
                >
                    <ArrowRight className="w-4 h-4 mr-1 opacity-70 rotate-180 group-hover:-translate-x-1 transition-transform" />
                    Already have an account? Login
                </button>
            </div>
        </div>
    );
};


const AuthPage = ({ setView, setUser, setLoggedIn }) => {
    const [mode, setMode] = useState('login'); // 'login' or 'register'

    return (
        <div className="flex justify-center items-center min-h-screen pt-12 md:pt-0">
            {mode === 'login' ? (
                <LoginForm 
                    setView={setView} 
                    setUser={setUser} 
                    setLoggedIn={setLoggedIn} 
                    switchToRegister={() => setMode('register')} 
                />
            ) : (
                <RegisterForm 
                    setView={setView} 
                    setUser={setUser} 
                    setLoggedIn={setLoggedIn} 
                    switchToLogin={() => setMode('login')} 
                />
            )}
        </div>
    );
};

export default AuthPage;