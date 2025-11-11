import React from 'react';
import { MapPin, User, Settings, LogOut } from 'lucide-react';

const NavItem = ({ icon: Icon, label, currentView, targetView, setView, setIsDrawerOpen }) => (
    <button
        onClick={() => {
            setView(targetView);
            setIsDrawerOpen(false); // Close drawer on mobile after click
        }}
        className={`w-full flex items-center p-3 rounded-xl transition-colors duration-200 ${currentView === targetView ? 'bg-indigo-700 text-white font-bold shadow-md' : 'text-gray-300 hover:bg-gray-700'}`}
    >
        <Icon className="w-5 h-5 mr-3" />
        {label}
    </button>
);

const Sidebar = ({ view, setView, user, setIsDrawerOpen, setLoggedIn, setUser, initialProfileState, isDrawerOpen }) => (
    // Changed the main container to flex-col and used 'relative' to contain the absolute footer properly.
    <div className={`
        fixed top-0 left-0 h-full w-64 bg-gray-900 shadow-2xl z-40 transition-transform duration-300
        ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:w-64 md:flex-shrink-0 md:border-r border-gray-700
        flex flex-col 
    `}>
        
        {/* Navigation Content Area (p-6 and flex-grow ensures it takes up available space) */}
        <div className="p-6 flex-grow overflow-y-auto">
            <h2 className="text-3xl font-extrabold text-indigo-400 mb-8">Menu</h2>
            <nav className="space-y-3">
                <NavItem icon={MapPin} label="Dashboard" currentView={view} targetView="dashboard" setView={setView} setIsDrawerOpen={setIsDrawerOpen} />
                <NavItem icon={User} label="Profile" currentView={view} targetView="profile" setView={setView} setIsDrawerOpen={setIsDrawerOpen} />
                <NavItem icon={Settings} label="Settings" currentView={view} targetView="settings" setView={setView} setIsDrawerOpen={setIsDrawerOpen} />
            </nav>
        </div>

        {/* LOGOUT BUTTON FIX: Changed from absolute positioning to be the final element in the flex-col container. 
            This ensures it is pushed to the bottom and does not overlap the flex-grown content.
            Removed: absolute bottom-4 left-0 w-full
        */}
        <div className="p-4 border-t border-gray-700 flex-shrink-0">
            <div className="text-gray-400 text-sm mb-2 px-2">Signed in as: <span className="text-white font-semibold">{user.username || 'Guest'}</span></div>
            <button
                onClick={() => {
                    setUser(initialProfileState);
                    setLoggedIn(false);
                    setView('login');
                    setIsDrawerOpen(false);
                }}
                className="w-full flex items-center px-4 py-2 bg-red-700 text-white font-semibold rounded-lg hover:bg-red-800 transition-colors duration-200"
            >
                <LogOut className="w-5 h-5 mr-2" /> Logout
            </button>
        </div>
    </div>
);

export default Sidebar;