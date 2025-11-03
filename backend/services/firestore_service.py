# backend/services/firestore_service.py
from core.firebase_init import db
from datetime import datetime

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
