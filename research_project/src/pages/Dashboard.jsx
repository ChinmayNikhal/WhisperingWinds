import React, { useState, useMemo, useCallback } from 'react';
import {
    RefreshCw, MapPin, Wind, AlertTriangle, ArrowRight, XCircle, Clock,
    TrendingUp, Send
} from 'lucide-react';
import { initialAQIData, getAQIRecommendation, getFormattedDate } from '../utils/AQILogic';
import LocationCard from '../components/LocationCard';
import NotificationCard from '../components/NotificationCard';

// Helper to determine if the search date is in the future
const isFutureDate = (searchDate) => {
    const today = getFormattedDate(new Date());
    return searchDate > today;
};

const Dashboard = ({ user }) => {
    // State for Search Inputs
    const [currentLocation, setCurrentLocation] = useState(initialAQIData.currentLocation);
    const [latitude, setLatitude] = useState(28.4595); // Default Latitude for Gurgaon
    const [longitude, setLongitude] = useState(77.0266); // Default Longitude for Gurgaon
    const [searchDate, setSearchDate] = useState(getFormattedDate(new Date()));

    // State for Data Display
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(initialAQIData);

    const { isBadForUser, recommendation, riskColor, aqiCategory, sensitivity } = useMemo(() =>
        getAQIRecommendation(data.currentAQI, user)
        , [data, user]);

    // Handle initial refresh (current data check)
    const handleRefresh = useCallback(async () => {
        setLoading(true);
        // Mock data fetching delay
        await new Promise(resolve => setTimeout(resolve, 1200));

        // Simulate getting current (randomized) data for the location
        setData(p => ({
            ...p,
            currentAQI: Math.floor(Math.random() * 200) + 50,
            lastUpdated: new Date().toLocaleTimeString(),
        }));
        setLoading(false);
    }, []);

    // Handle Forecast/Search
    const handleSearch = (e) => {
        e.preventDefault();
        setLoading(true);
        const isForecast = isFutureDate(searchDate);

        setTimeout(() => {
            let newAQI;
            let warningActive;
            let newLocationName = `${currentLocation} (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`;

            // MOCK LOGIC: Simulate better air for future dates or remote coordinates
            if (isForecast || (latitude < 27.0 && longitude > 78.0)) {
                newAQI = Math.floor(Math.random() * 80) + 10; // Good/Moderate forecast
                warningActive = false;
            } else {
                newAQI = Math.floor(Math.random() * 150) + 150; // Unhealthy current status
                warningActive = true;
            }

            setData({
                ...initialAQIData,
                currentLocation: newLocationName,
                currentAQI: newAQI,
                lastUpdated: isForecast ? `Forecast for ${searchDate}` : new Date().toLocaleTimeString(),
                eventWarning: { ...initialAQIData.eventWarning, active: warningActive }
            });
            setLoading(false);
        }, 1000);
    };

    const isForecastCheck = isFutureDate(searchDate);

    const mainIcon = isForecastCheck ? <TrendingUp className="w-6 h-6 mr-2 text-indigo-400" /> : <MapPin className="w-6 h-6 mr-2 text-indigo-400" />;


    return (
        <div className="p-4 md:p-8 pt-0 max-w-4xl mx-auto">
            <h2 className="text-4xl font-extrabold text-white mb-6">AQI Dashboard</h2>

            {/* Location, Coordinates, and Date Input Form */}
            <form onSubmit={handleSearch} className="mb-12">
                <div className="rounded-2xl shadow-2xl overflow-hidden bg-gray-800/50 backdrop-blur-sm p-4 border border-indigo-700/50">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        
                        {/* 1. Location Name */}
                        <div className="col-span-1 md:col-span-4 flex items-center bg-gray-700 rounded-lg">
                            <MapPin className="w-5 h-5 text-indigo-400 ml-3 shrink-0" />
                            <input
                                type="text"
                                value={currentLocation}
                                onChange={(e) => setCurrentLocation(e.target.value)}
                                placeholder="Enter location (e.g., Pune, Mumbai)"
                                className="w-full p-3 bg-transparent text-white placeholder-gray-400 focus:outline-none text-base"
                            />
                        </div>

                        {/* 2. Latitude */}
                        <div className="col-span-2 md:col-span-1 flex items-center bg-gray-700 rounded-lg">
                            <span className="text-gray-400 ml-3 shrink-0 text-sm font-medium">Lat:</span>
                            <input
                                type="number"
                                step="0.0001"
                                value={latitude}
                                onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
                                placeholder="Latitude"
                                className="w-full p-3 bg-transparent text-white placeholder-gray-400 focus:outline-none text-base"
                            />
                        </div>

                        {/* 3. Longitude */}
                        <div className="col-span-2 md:col-span-1 flex items-center bg-gray-700 rounded-lg">
                            <span className="text-gray-400 ml-3 shrink-0 text-sm font-medium">Lng:</span>
                            <input
                                type="number"
                                step="0.0001"
                                value={longitude}
                                onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
                                placeholder="Longitude"
                                className="w-full p-3 bg-transparent text-white placeholder-gray-400 focus:outline-none text-base"
                            />
                        </div>

                        {/* 4. Date Picker (Forecast) */}
                        <div className="col-span-2 md:col-span-1 flex items-center bg-gray-700 rounded-lg">
                            <Clock className="w-5 h-5 text-indigo-400 ml-3 shrink-0" />
                            <input
                                type="date"
                                value={searchDate}
                                onChange={(e) => setSearchDate(e.target.value)}
                                min={getFormattedDate(new Date())} // Prevents picking dates in the past
                                className="w-full p-3 bg-transparent text-white placeholder-gray-400 focus:outline-none text-base [&::-webkit-calendar-picker-indicator]:invert"
                            />
                        </div>
                        
                        {/* 5. Submit Button */}
                        <button
                            type="submit"
                            className="col-span-2 md:col-span-1 px-6 py-3 bg-indigo-600 text-white font-bold text-base hover:bg-indigo-700 transition-colors duration-300 rounded-lg flex items-center justify-center shadow-lg"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    <Send className="w-5 h-5 mr-2" />
                                    {isForecastCheck ? 'Get Forecast' : 'Search/Update'}
                                </>
                            )}
                        </button>

                    </div>
                    <p className="text-xs text-gray-500 mt-3 px-1">
                        **Note:** Using a future date (or coordinates) mocks a simulated **AQI Forecast**.
                    </p>
                </div>
            </form>

            {/* Proactive Notification Card */}
            <NotificationCard warning={data.eventWarning} />

            {/* Main Dashboard Grid */}
            <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* 1. Personalized AQI Assessment Card (Large) */}
                <div className="lg:col-span-2 p-8 rounded-2xl shadow-2xl border border-gray-700/50" style={{ backgroundColor: '#1f2937' }}>
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-3xl font-bold text-white flex items-center">
                            {mainIcon}
                            Air Quality for {data.currentLocation}
                        </h2>
                        <button
                            onClick={handleRefresh}
                            disabled={loading}
                            className="text-sm text-indigo-300 hover:text-indigo-400 flex items-center transition-colors"
                        >
                            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                            {loading ? 'Refreshing...' : 'Refresh Current'}
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
                        <div className="text-center sm:text-left">
                            <p className="text-7xl font-extrabold text-white">{data.currentAQI}</p>
                            <p className={`text-lg font-semibold px-3 py-1 rounded-full mt-2 inline-block ${riskColor}`}>
                                {aqiCategory}
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0 text-center sm:text-right">
                            <p className="text-gray-400">Your Sensitivity Profile:</p>
                            <p className="text-indigo-300 font-medium">{sensitivity}</p>
                            <p className="text-gray-500 text-xs mt-1">Status: {data.lastUpdated}</p>
                        </div>
                    </div>

                    <div className={`p-4 rounded-xl text-lg font-medium shadow-inner ${isBadForUser ? 'bg-red-500/20 border border-red-500' : 'bg-green-500/20 border border-green-500'}`}>
                        <h3 className="text-xl font-bold mb-2 flex items-center">
                            {isBadForUser ? <XCircle className="w-5 h-5 mr-2 text-red-400" /> : <Wind className="w-5 h-5 mr-2 text-green-400" />}
                            Personalized Assessment for {user.username}:
                        </h3>
                        <p className={`${isBadForUser ? 'text-red-300' : 'text-green-300'}`}>{recommendation}</p>
                    </div>
                </div>

                {/* 2. Nearest Good AQI Locations Card (Smaller) */}
                <div className="p-6 bg-gray-800 rounded-2xl shadow-xl border border-gray-700/50">
                    <h2 className="text-2xl font-bold text-indigo-300 mb-4 flex items-center">
                        <MapPin className="w-5 h-5 mr-2" />
                        Nearest Safe Havens
                    </h2>
                    <p className="text-sm text-gray-400 mb-4">
                        Locations currently under AQI 80.
                    </p>
                    <div className="space-y-3">
                        {data.nearestGoodLocations.map(loc => (
                            <LocationCard key={loc.id} {...loc} />
                        ))}
                        {data.currentAQI < 80 && (
                            <p className="text-xs text-gray-500 mt-4 italic">
                                Your current location is already a safe haven!
                            </p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;