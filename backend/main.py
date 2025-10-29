from fastapi import FastAPI, Query
from services.aqi_fetcher import get_current_aqi
from services.firestore_service import save_aqi_data

app = FastAPI(title="WhisperingWinds API")

@app.get("/")
def root():
    return {"message": "🌿 WhisperingWinds API is running!"}

@app.get("/aqi/current")
def current_aqi(lat: float = Query(...), lon: float = Query(...), user_id: str = Query("test_user")):
    try:
        data = get_current_aqi(lat, lon)
        if "error" not in data:
            save_aqi_data(user_id, data)
        return data
    except Exception as e:
        print("❌ Error in /aqi/current:", e)
        return {"error": str(e)}
