# backend/services/firestore_service.py
from core.firebase_init import db
from datetime import datetime

from google.cloud import firestore

db = firestore.Client()

def save_aqi_data(data: dict):
    """
    Save AQI data to Firestore.
    Stores data under collection 'aqi_data', document ID = timestamp.
    """
    if not db:
        print("Firestore not available — skipping save.")
        return
    
    try:
        timestamp = datetime.utcnow().isoformat()
        doc_ref = db.collection("aqi_data").document(timestamp)
        doc_ref.set(data)
        print(f"AQI data saved to Firestore: {timestamp}")
    except Exception as e:
        print(f"Error saving AQI data: {e}")

def get_user_aqi_history(user_id: str, limit: int = 10):
    """
    Fetches the user's recent AQI readings (latest first)
    """
    try:
        records_ref = (
            db.collection("users")
            .document(user_id)
            .collection("aqi_records")
            .order_by("timestamp", direction=firestore.Query.DESCENDING)
            .limit(limit)
        )
        docs = records_ref.stream()
        history = [doc.to_dict() for doc in docs]
        return history
    except Exception as e:
        print(f"Error fetching AQI history: {e}")
        return []