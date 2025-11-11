# backend/core/firebase_init.py
import firebase_admin
from firebase_admin import credentials, firestore
from core.config import FIREBASE_SERVICE_ACCOUNT
import os

db = None

try:
    cred_path = os.path.join(os.getcwd(), FIREBASE_SERVICE_ACCOUNT)
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)
    print("Firebase initialized with project ID:", firebase_admin.get_app().project_id)

    db = firestore.client()
    print("Firebase successfully initialized.")
except Exception as e:
    print(f"Firebase not initialized yet: {e}")
