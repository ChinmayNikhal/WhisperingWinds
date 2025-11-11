import React, { useState, useEffect } from 'react';
import { User, CheckCircle, Save } from 'lucide-react';

const ProfilePage = ({ user, setUser }) => {
    const [tempUser, setTempUser] = useState(user);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (saved) {
            const timer = setTimeout(() => setSaved(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [saved]);

    const handleSave = (e) => {
        e.preventDefault();

        // Re-calculate sensitivity based on new inputs
        const newSensitivity = tempUser.hasAsthma || tempUser.age >= 65
            ? 'High (Asthma/Age)'
            : 'Low (General Population)';

        const updatedUser = {
            ...tempUser,
            sensitivity: newSensitivity,
        };

        setUser(updatedUser);
        setSaved(true);
    };

    return (
        <div className="p-4 md:p-8 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-indigo-400 mb-6 flex items-center"><User className="w-6 h-6 mr-2" /> User Profile</h2>

            {saved && (
                <div className="p-4 mb-4 bg-green-500/20 text-green-300 rounded-lg flex items-center font-semibold">
                    <CheckCircle className="w-5 h-5 mr-2" /> Profile updated successfully!
                </div>
            )}

            <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700 space-y-6">
                <form onSubmit={handleSave} className="space-y-5">
                    {/* Username */}
                    <div className="flex flex-col">
                        <label className="text-gray-400 mb-1">Username</label>
                        <input
                            type="text"
                            value={tempUser.username}
                            onChange={(e) => setTempUser(p => ({ ...p, username: e.target.value }))}
                            className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-indigo-500"
                            required
                        />
                    </div>

                    {/* Age */}
                    <div className="flex flex-col">
                        <label className="text-gray-400 mb-1">Age</label>
                        <input
                            type="number"
                            value={tempUser.age}
                            onChange={(e) => setTempUser(p => ({ ...p, age: parseInt(e.target.value) || 0 }))}
                            min="1"
                            max="120"
                            className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-indigo-500"
                            required
                        />
                    </div>

                    {/* Health Condition */}
                    <div className="flex items-center justify-between bg-gray-700 p-3 rounded-lg border border-gray-600">
                        <label htmlFor="edit-asthma" className="text-white font-medium">Has Asthma/Respiratory Condition?</label>
                        <input
                            type="checkbox"
                            id="edit-asthma"
                            checked={tempUser.hasAsthma}
                            onChange={(e) => setTempUser(p => ({ ...p, hasAsthma: e.target.checked }))}
                            className="h-5 w-5 text-indigo-500 border-gray-300 rounded focus:ring-indigo-500"
                        />
                    </div>

                    {/* Sensitivity Readout */}
                    <div className="p-3 bg-indigo-900/50 rounded-lg border border-indigo-700">
                        <p className="text-gray-300 font-semibold">Inferred AQI Sensitivity:</p>
                        <p className="text-indigo-200">{tempUser.sensitivity}</p>
                        <p className="text-xs text-gray-500 mt-1">
                            (This is automatically set based on Age {'\u003e'}= 65 or Respiratory Condition)
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors duration-300 flex items-center justify-center space-x-2"
                    >
                        <Save className="w-5 h-5" />
                        <span>Save Profile Changes</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;