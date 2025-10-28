from datetime import datetime
from core.firebase_init import db

def save_aqi_data(user_id: str, data: dict):
    ref = db.collection("users").document(user_id).collection("aqi_data")
    ref.add({
        "timestamp": datetime.utcnow(),
        "aqi": data.get("aqi"),
        "pollutants": data.get("pollutants")
    })
