import requests
import json
from core.config import GOOGLE_API_KEY

BASE_URL = "https://airquality.googleapis.com/v1/currentConditions:lookup"

def get_current_aqi(lat: float, lon: float):
    """
    Fetches AQI and pollutant data using Google Air Quality API.
    """
    if not GOOGLE_API_KEY or GOOGLE_API_KEY == "YOUR_API_KEY":
        return {"error": "Missing or invalid Google API key in .env"}

    headers = {"Content-Type": "application/json"}
    payload = {
        "location": {"latitude": lat, "longitude": lon},
        "extraComputations": ["POLLUTANT_CONCENTRATION"],
        "universalAqi": True,
        "languageCode": "en"
    }

    try:
        response = requests.post(f"{BASE_URL}?key={GOOGLE_API_KEY}", headers=headers, data=json.dumps(payload))

        if response.status_code != 200:
            return {"error": f"API returned {response.status_code}", "details": response.text}

        data = response.json()

        # Extract the main AQI info
        indexes = data.get("indexes", [])
        if not indexes:
            return {"error": "No AQI index data available", "raw": data}

        main_index = indexes[0]
        aqi_value = main_index.get("aqi", "N/A")
        category = main_index.get("category", "Unknown")
        dominant_pollutant = main_index.get("dominantPollutant", "Unknown")

        # Extract pollutant concentrations
        pollutants_data = data.get("pollutants", [])
        pollutants = {}
        for pollutant in pollutants_data:
            code = pollutant.get("code", "").upper()
            concentration = pollutant.get("concentration", {})
            value = concentration.get("value")
            units = concentration.get("units")
            if code and value is not None:
                pollutants[code] = {"value": value, "units": units}

        return {
            "location": f"{lat},{lon}",
            "aqi": aqi_value,
            "category": category,
            "dominant_pollutant": dominant_pollutant,
            "pollutants": pollutants,
            "timestamp": data.get("dateTime", "N/A"),
            "regionCode": data.get("regionCode", "N/A")
        }

    except requests.exceptions.RequestException as e:
        return {"error": f"Connection failed: {e}"}
