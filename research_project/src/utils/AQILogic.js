// Removed the problematic 'import { format } from 'date-fns';'
// We will rely on built-in JavaScript Date methods instead, which is safer here.

// --- INITIAL DATA & CONSTANTS ---
export const initialProfileState = {
    isLoggedIn: false,
    username: '',
    age: 30,
    hasAsthma: false,
    sensitivity: 'Low (General Population)',
};

export const initialAQIData = {
    currentLocation: 'Gurgaon, India',
    currentAQI: 185, // Mocked to show 'bad' air initially
    lastUpdated: new Date().toLocaleTimeString(),
    nearestGoodLocations: [
        { id: 1, name: 'Vrindavan Park', aqi: 52, distance: '15 km' },
        { id: 2, name: 'National Eco Garden', aqi: 68, distance: '25 km' },
        { id: 3, name: 'Mountain Retreat, Mussoorie', aqi: 35, distance: '280 km' },
    ],
    eventWarning: {
        active: true,
        name: 'Upcoming Crop Burning Season Peak',
        dateRange: 'Next 5 Days (Nov 15 - 20)',
        aqiPrediction: 'Hazardous (AQI 400+)',
        recommendedTravel: 'Shimla Valley or Coastal Regions',
    },
};

// --- HELPER LOGIC (Personalization) ---
export const getAQIRecommendation = (aqi, userProfile) => {
    let isBadForUser = false;
    let recommendation = '';
    let riskColor = 'bg-green-600';
    let aqiCategory = 'Good';

    // Determine user sensitivity based on profile
    const isHighlySensitive = userProfile.hasAsthma || userProfile.age >= 65;

    if (aqi <= 50) {
        recommendation = 'Excellent air quality. Go out and enjoy your day!';
        riskColor = 'bg-green-600';
        aqiCategory = 'Good';
    } else if (aqi <= 100) {
        recommendation = 'Acceptable air quality.';
        riskColor = 'bg-yellow-600';
        aqiCategory = 'Moderate';
        if (isHighlySensitive) {
            recommendation += ' Sensitive groups should limit prolonged outdoor exertion.';
        }
    } else if (aqi <= 150) {
        riskColor = 'bg-orange-600';
        aqiCategory = 'Unhealthy for Sensitive Groups';
        if (isHighlySensitive) {
            isBadForUser = true;
            recommendation = 'Air quality is UNHEALTHY for your condition. AVOID outdoor exertion.';
        } else {
            recommendation = 'Sensitive groups should limit outdoor exertion. Generally safe for healthy individuals.';
        }
    } else {
        riskColor = 'bg-red-600';
        aqiCategory = aqi <= 200 ? 'Unhealthy' : 'Very Unhealthy';
        isBadForUser = true;
        recommendation = `Air quality is DANGEROUSLY high at ${aqi}. STAY INDOORS and run an air purifier.`;
    }

    return { isBadForUser, recommendation, riskColor, aqiCategory, sensitivity: isHighlySensitive ? 'High (Asthma/Age)' : 'Low (General Population)' };
};

// --- NEW DATE UTILITY ---
export const getFormattedDate = (date) => {
    // Basic date formatting helper (YYYY-MM-DD)
    const d = new Date(date);
    // Use padding function to ensure two digits
    const pad = (num) => (num < 10 ? '0' + num : num);

    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const year = d.getFullYear();

    return [year, month, day].join('-');
};