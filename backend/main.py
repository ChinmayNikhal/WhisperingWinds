# python -m uvicorn main:app --reload

from fastapi import FastAPI, Query, HTTPException
from services.aqi_fetcher import get_current_aqi
from services.firestore_service import save_aqi_data
from services.auth_service import verify_token

app = FastAPI(title="WhisperingWinds API")

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
def current_aqi(
    lat: float = Query(...),
    lon: float = Query(...),
    token: str = Query(...)
):
    uid = verify_token(token)
    if not uid:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    data = get_current_aqi(lat, lon)
    if "error" not in data:
        save_aqi_data(uid, data)
    return data