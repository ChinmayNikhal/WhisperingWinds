import React from 'react';
import { Settings } from 'lucide-react';

const SettingsPage = () => (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-indigo-400 mb-6 flex items-center"><Settings className="w-6 h-6 mr-2" /> Settings</h2>
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
            <p className="text-gray-400">Settings functionality coming soon.</p>
            <ul className="mt-4 space-y-2 text-white">
                <li>Notification Preferences</li>
                <li>Location History</li>
                <li>Data Management</li>
            </ul>
        </div>
    </div>
);

export default SettingsPage;