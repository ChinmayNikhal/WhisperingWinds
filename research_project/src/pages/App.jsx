import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { initialProfileState } from '../utils/AQILogic';
import Sidebar from '../components/Sidebar';
import Dashboard from './Dashboard';
import LoginPage from './LoginPage'; // The imported component is now the AuthPage logic
import ProfilePage from './ProfilePage';
import SettingsPage from './SettingsPage';

const App = () => {
    const [view, setView] = useState('login'); // 'login', 'dashboard', 'profile', 'settings'
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [user, setUser] = useState(initialProfileState);
    const [isLoggedIn, setLoggedIn] = useState(false);

    const renderContent = () => {
        if (!isLoggedIn) {
            // LoginPage component now contains the logic for both Login and Register views
            return <LoginPage setView={setView} setUser={setUser} setLoggedIn={setLoggedIn} />;
        }

        switch (view) {
            case 'dashboard':
                return <Dashboard user={user} />;
            case 'profile':
                return <ProfilePage user={user} setUser={setUser} />;
            case 'settings':
                return <SettingsPage />;
            default:
                return <Dashboard user={user} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans flex">
            {/* Mobile Menu Button */}
            {isLoggedIn && (
                <button
                    className="fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-full shadow-lg md:hidden"
                    onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                >
                    <Menu className="w-6 h-6 text-indigo-400" />
                </button>
            )}

            {/* Sidebar (Desktop always visible, Mobile modal) */}
            {isLoggedIn && (
                <Sidebar
                    view={view}
                    setView={setView}
                    user={user}
                    setIsDrawerOpen={setIsDrawerOpen}
                    setLoggedIn={setLoggedIn}
                    setUser={setUser}
                    initialProfileState={initialProfileState}
                    isDrawerOpen={isDrawerOpen}
                />
            )}

            {/* Main Content Area */}
            {/* ml-64 conditionally applied on desktop to make room for the sidebar */}
            <div className={`flex-grow min-h-screen pt-12 ${isLoggedIn ? 'md:ml-64' : 'md:ml-0'}`}>
                {/* Mobile Drawer Overlay */}
                {isDrawerOpen && isLoggedIn && (
                    <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsDrawerOpen(false)}></div>
                )}

                <div className="p-4 pt-8">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default App;