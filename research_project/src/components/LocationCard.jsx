import React from 'react';

const LocationCard = ({ name, aqi, distance }) => (
    <div className="p-4 bg-gray-700/50 rounded-xl shadow-lg hover:bg-gray-600/70 transition duration-200">
        <div className="flex justify-between items-center">
            <h4 className="font-semibold text-lg text-white">{name}</h4>
            <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-300">{distance}</span>
                <span className="px-3 py-1 text-sm font-bold rounded-full bg-green-500 text-gray-900">AQI {aqi}</span>
            </div>
        </div>
    </div>
);

export default LocationCard;