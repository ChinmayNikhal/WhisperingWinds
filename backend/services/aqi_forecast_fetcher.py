import requests
import json
from datetime import datetime, timezone
from core.config import GOOGLE_API_KEY

BASE_URL = "https://airquality.googleapis.com/v1/forecast:lookup"

def fetch_aqi_forecast(lat: float, lon: float, start_time: str, end_time: str):
    """
    Fetches the AQI forecast series between start_time and end_time for given coordinates.
    This uses the Google Air Quality API forecast:lookup endpoint.
    """

    if not GOOGLE_API_KEY or GOOGLE_API_KEY == "YOUR_API_KEY":
        return {"error": "Missing or invalid Google API key in .env"}

    print("🌍 Fetching Air Quality Forecast Series:")
    print(f"   → Latitude: {lat}")
    print(f"   → Longitude: {lon}")
    print(f"   → Start Time: {start_time}")
    print(f"   → End Time: {end_time}")

    # ✅ API URL and Headers
    url = f"{BASE_URL}?key={GOOGLE_API_KEY}"
    headers = {
        "Content-Type": "application/json",
        "Accept-Language": "*"
    }

    # ✅ Request payload (same structure as your standalone test script)
    payload = {
        "universalAqi": True,
        "location": {
            "latitude": lat,
            "longitude": lon
        },
        "period": {
            "startTime": start_time,  # RFC 3339 format
            "endTime": end_time
        },
        "languageCode": "en"
    }

    try:
        print("--- Sending Forecast Request ---")
        response = requests.post(url, headers=headers, json=payload)

        if response.status_code != 200:
            print(f"❌ Google API Error {response.status_code}: {response.text}")
            return {"error": f"Google API error {response.status_code}", "details": response.text}

        data = response.json()
        forecasts = data.get("forecasts", [])
        if not forecasts:
            print("⚠️ No forecast data returned.")
            return {"status": "empty", "message": "No forecast data returned", "raw": data}

        print(f"✅ Retrieved {len(forecasts)} forecast points.")
        parsed_results = []

        for f in forecasts:
            # Extract AQI index data (usually under "indexes")
            aqi_info = None
            for idx in f.get("indexes", []):
                if idx.get("code") == "uaqi":
                    aqi_info = idx
                    break

            pollutants = [
                {
                    "code": p.get("code"),
                    "displayName": p.get("displayName"),
                    "value": p.get("concentration", {}).get("value"),
                    "units": p.get("concentration", {}).get("units")
                }
                for p in f.get("pollutants", [])
            ]

            parsed_results.append({
                "timestamp": f.get("dateTime"),
                "aqi": aqi_info.get("aqi") if aqi_info else None,
                "category": aqi_info.get("category") if aqi_info else None,
                "dominant_pollutant": aqi_info.get("dominantPollutant") if aqi_info else None,
                "pollutants": pollutants
            })

        result = {
            "status": "ok",
            "lat": lat,
            "lon": lon,
            "start_time": start_time,
            "end_time": end_time,
            "count": len(parsed_results),
            "forecast_series": parsed_results,
            "regionCode": data.get("regionCode")
        }

        print("--- Forecast Data Received ---")
        print(json.dumps(result, indent=2))
        return result

    except requests.exceptions.RequestException as e:
        print(f"🔥 Network error during forecast request: {e}")
        return {"error": str(e)}
    
# def fetch_aqi_forecast(lat: float, lon: float, target_time: str):
#     """
#     Fetch AQI forecast for a given lat/lon and UTC time using Google Air Quality API.
#     """

#     if not GOOGLE_API_KEY or GOOGLE_API_KEY == "YOUR_API_KEY":
#         return {"error": "Missing or invalid Google API key in .env"}

#     print(f"🛰️ Received Forecast Request:")
#     print(f"   → Latitude: {lat}")
#     print(f"   → Longitude: {lon}")
#     print(f"   → Target Time (UTC): {target_time}")

#     result = fetch_forecast(lat, lon, GOOGLE_API_KEY, target_time)
#     return result


# def fetch_forecast(lat, lon, api_key, target_time):
#     url = f"{BASE_URL}?key={api_key}"
#     payload = {
#         "location": {"latitude": lat, "longitude": lon},
#         "dateTime": target_time,
#         "extraComputations": ["POLLUTANT_CONCENTRATION"],
#         "universalAqi": True,
#         "languageCode": "en"
#     }

#     response = requests.post(url, json=payload)
#     if response.status_code != 200:
#         print(f"❌ Error {response.status_code}: {response.text}\n")
#         return {"error": f"Google API error {response.status_code}", "details": response.text}

#     data = response.json()

#     # ✅ Handle both possible keys (forecast or hourlyForecasts)
#     forecasts = data.get("forecasts") or data.get("hourlyForecasts") or []
#     if not forecasts:
#         print("⚠️ No forecast data returned.")
#         print(json.dumps(data, indent=2))
#         return {"status": "empty", "message": "No forecast data returned", "raw": data}

#     print(f"✅ Forecast retrieved for {target_time}")
#     forecast = forecasts[0]  # Take the first (closest) entry

#     # Extract AQI info
#     aqi_info = None
#     for idx in forecast.get("indexes", []):
#         if idx.get("code") == "uaqi":
#             aqi_info = idx
#             break

#     # Extract pollutant data
#     pollutants = [
#         {
#             "code": p.get("code"),
#             "displayName": p.get("displayName"),
#             "value": p.get("concentration", {}).get("value"),
#             "units": p.get("concentration", {}).get("units")
#         }
#         for p in forecast.get("pollutants", [])
#     ]

#     result = {
#         "status": "ok",
#         "timestamp": forecast.get("dateTime"),
#         "aqi": aqi_info.get("aqi") if aqi_info else None,
#         "category": aqi_info.get("category") if aqi_info else None,
#         "dominant_pollutant": aqi_info.get("dominantPollutant") if aqi_info else None,
#         "pollutants": pollutants,
#         "regionCode": data.get("regionCode")
#     }

#     print("───────────────\n")
#     print(json.dumps(result, indent=2))
#     print("───────────────\n")

#     return result
