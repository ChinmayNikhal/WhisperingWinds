import requests
from core.config import GOOGLE_API_KEY

BASE_URL = "https://airquality.googleapis.com/v1/currentConditions:lookup"

def get_current_aqi(lat: float, lon: float):
    url = f"{BASE_URL}?key={GOOGLE_API_KEY}"
    payload = {
        "location": {
            "latitude": lat,
            "longitude": lon
        },
        "languageCode": "en"
    }

    response = requests.post(url, json=payload)
    if response.status_code != 200:
        return {"error": response.text}

    data = response.json()
    pollution = data.get("indexes", [{}])[0]
    aqi_value = pollution.get("aqi", "N/A")
    pollutants = pollution.get("pollutants", [])

    result = {
        "aqi": aqi_value,
        "pollutants": {p["code"]: p["concentration"]["value"] for p in pollutants}
    }

    return result
