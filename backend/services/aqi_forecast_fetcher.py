import requests
import datetime
import json
import time
from core.config import GOOGLE_API_KEY

API_URL = "https://airquality.googleapis.com/v1/forecast:lookup"
MAX_RETRIES = 5
MAX_FORECAST_HOURS = 72  # Google limit


def fetch_air_quality_forecast(lat: float, lon: float, target_time: str = None):
    """
    Fetch forecasted air quality for given coordinates and an optional future datetime.
    Auto-adjusts to nearest available forecast time (within 72 hours).
    Returns: { date, time, aqi }
    """
    if not GOOGLE_API_KEY or GOOGLE_API_KEY == "YOUR_API_KEY":
        return {"error": "Missing or invalid Google API key in .env"}

    # --- Parse or default to tomorrow same hour ---
    now_utc = datetime.datetime.now(datetime.timezone.utc)
    if target_time:
        try:
            base_date = datetime.datetime.fromisoformat(target_time.replace("Z", "+00:00"))
            if base_date.tzinfo is None:
                base_date = base_date.replace(tzinfo=datetime.timezone.utc)
        except ValueError:
            return {"error": "Invalid datetime format. Use ISO 8601 (YYYY-MM-DDTHH:MM:SSZ)"}
    else:
        base_date = (now_utc + datetime.timedelta(days=1)).replace(minute=0, second=0, microsecond=0)

    # Clamp to max 72 hours
    max_allowed = now_utc + datetime.timedelta(hours=MAX_FORECAST_HOURS)
    if base_date > max_allowed:
        print(f"[INFO] Requested date too far ({base_date}). Clamping to {max_allowed}.")
        base_date = max_allowed

    # Try decreasing the forecast hour if no data
    for back_offset in range(0, 6):  # try up to 6 hours earlier
        date_time_utc = (base_date - datetime.timedelta(hours=back_offset)).strftime("%Y-%m-%dT%H:00:00Z")

        print(f"\n--- Fetching AQI Forecast ---")
        print(f"📍 Location: {lat}, {lon}")
        print(f"🕒 Target UTC time: {date_time_utc}")

        payload = {
            "location": {"latitude": lat, "longitude": lon},
            "dateTime": date_time_utc,
            "extraComputations": ["POLLUTANT_ADDITIONAL_INFO"],
            "universalAqi": True,
            "languageCode": "en",
        }

        headers = {"Content-Type": "application/json", "Accept-Language": "*"}

        for attempt in range(1, MAX_RETRIES + 1):
            try:
                response = requests.post(
                    f"{API_URL}?key={GOOGLE_API_KEY}",
                    headers=headers,
                    data=json.dumps(payload),
                    timeout=10,
                )

                if response.status_code == 200:
                    data = response.json()
                    if not data.get("forecasts"):
                        print(f"[DEBUG] No forecast data for {date_time_utc}")
                        break  # try earlier hour

                    forecast = data["forecasts"][0]
                    aqi_info = forecast.get("aqiInfo", {})
                    aqi_value = aqi_info.get("aqi")

                    result = {
                        "date": forecast.get("dateTime", "")[:10],
                        "time": forecast.get("dateTime", "")[11:19],
                        "aqi": aqi_value if aqi_value is not None else "N/A",
                    }

                    print(f"✅ AQI forecast: {result}")
                    return result

                elif response.status_code == 429:
                    delay = 2 ** attempt
                    print(f"[WARN] Rate limit hit. Retrying in {delay}s...")
                    time.sleep(delay)

                else:
                    print(f"[ERROR] API {response.status_code}: {response.text}")
                    break

            except requests.exceptions.RequestException as e:
                if attempt < MAX_RETRIES:
                    delay = 2 ** attempt
                    print(f"[WARN] Network error: {e}. Retrying in {delay}s...")
                    time.sleep(delay)
                else:
                    print(f"[CRITICAL] Max retries reached: {e}")
                    break

        time.sleep(0.3)

    return {"error": "No forecast data available even after fallback attempts"}


# def get_forecast_time(base_date, hour_offset):
#     """
#     Calculates ISO 8601 UTC timestamp for a specific hour offset.
#     Example: 2025-10-08T14:00:00Z
#     """
#     date = base_date + datetime.timedelta(hours=hour_offset)
#     return date.strftime("%Y-%m-%dT%H:00:00Z")