# Run with: python -m uvicorn main:app --reload

from fastapi import FastAPI, Query, HTTPException
from services.aqi_fetcher import get_current_aqi
from services.firestore_service import get_user_aqi_history
from services.auth_service import verify_token
from models.forecast_model import simple_aqi_forecast
from firebase_admin import firestore
from datetime import datetime

from services.aqi_forecast_fetcher import fetch_aqi_forecast

app = FastAPI(title="WhisperingWinds API")
db = firestore.client()


@app.get("/")
def root():
    return {"message": "🌿 WhisperingWinds API is running!"}


@app.post("/auth/verify")
def verify_user_token(token: str = Query(...)):
    uid = verify_token(token)
    if not uid:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return {"uid": uid, "message": "Token verified successfully"}


@app.get("/aqi/current")
def current_aqi(lat: float, lon: float, token: str):
    """
    Fetches the current AQI for given coordinates and saves it to Firestore.
    """
    uid = verify_token(token)
    if not uid:
        raise HTTPException(status_code=401, detail="Invalid Firebase token")

    print(f"✅ Token verified for UID: {uid}")

    # ✅ FIXED: use correct AQI fetcher
    data = get_current_aqi(lat, lon)

    if not data or "aqi" not in data:
        raise HTTPException(status_code=404, detail="No AQI data found")

    save_aqi_data(uid, data)
    return data


@app.get("/aqi/history")
def get_aqi_history_route(token: str = Query(...), limit: int = Query(10)):
    """
    Retrieve last N AQI records for the authenticated user.
    """
    uid = verify_token(token)
    if not uid:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    history = get_user_aqi_history(uid, limit)
    return {"user_id": uid, "records": history}


@app.get("/aqi/forecast")
async def get_forecast(
    lat: float,
    lon: float,
    start_time: str,
    end_time: str,
    token: str
):
    uid = verify_token(token)
    if not uid:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    result = fetch_aqi_forecast(lat, lon, start_time, end_time)
    return result


def save_aqi_data(uid: str, data: dict):
    """
    Save AQI data to Firestore under user's history.
    """
    try:
        entry = {
            "aqi": data.get("aqi"),
            "dominant_pollutant": data.get("dominant_pollutant"),
            "category": data.get("category"),
            "lat": data.get("location", "").split(",")[0] if data.get("location") else None,
            "lon": data.get("location", "").split(",")[1] if data.get("location") else None,
            "timestamp": datetime.utcnow().isoformat(),
        }

        if entry["aqi"] in [None, "N/A"]:
            print("⚠️ No AQI value found, skipping save.")
            return

        db.collection("users").document(uid).collection("aqi_history").add(entry)
        print(f"✅ AQI data saved for user {uid}: {entry}")

    except Exception as e:
        print(f"🔥 Error saving AQI data for {uid}: {e}")

