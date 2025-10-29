import firebase_admin
from firebase_admin import credentials, firestore

try:
    cred = credentials.Certificate("backend/core/firebase-service-account.json")
    firebase_admin.initialize_app(cred)
except Exception as e:
    print("⚠️ Firebase not initialized yet:", e)
