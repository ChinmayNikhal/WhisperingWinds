import React from 'react';
import { AlertTriangle, ArrowRight } from 'lucide-react';

const NotificationCard = ({ warning }) => {
    if (!warning.active) return null;

    return (
        <div className="bg-red-900/50 backdrop-blur-md border border-red-700 p-6 rounded-2xl shadow-xl mb-8 animate-pulse">
            <div className="flex items-center mb-3">
                <AlertTriangle className="w-6 h-6 text-red-400 mr-3" />
                <h3 className="text-xl font-bold text-red-300">Proactive AQI Warning</h3>
            </div>
            <p className="text-white mb-2">
                Heads up! We anticipate a **{warning.aqiPrediction}** air quality spike in your region during the **{warning.dateRange}** due to **{warning.name}**.
            </p>
            <div className="mt-4 p-3 bg-red-800 rounded-lg flex items-center justify-between">
                <p className="text-sm text-red-200 font-semibold">
                    Suggested Safe Travel:
                    <span className="block text-white text-base font-bold">{warning.recommendedTravel}</span>
                </p>
                <ArrowRight className="w-5 h-5 text-red-200" />
            </div>
        </div>
    );
};

export default NotificationCard;