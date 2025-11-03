import os
from dotenv import load_dotenv
import pyrebase

# Load secrets from .env
load_dotenv()

firebase_config = {
    "apiKey": os.getenv("FIREBASE_API_KEY"),
    "authDomain": os.getenv("FIREBASE_AUTH_DOMAIN"),
    "projectId": os.getenv("FIREBASE_PROJECT_ID"),
    "storageBucket": os.getenv("FIREBASE_STORAGE_BUCKET"),
    "messagingSenderId": os.getenv("FIREBASE_MESSAGING_SENDER_ID"),
    "appId": os.getenv("FIREBASE_APP_ID"),
    "databaseURL": os.getenv("FIREBASE_DATABASE_URL", "")
}

firebase = pyrebase.initialize_app(firebase_config)
auth = firebase.auth()

# You can test with your Firebase test user here:
email = os.getenv("TEST_FIREBASE_EMAIL", "testuser@example.com")
password = os.getenv("TEST_FIREBASE_PASSWORD", "test1234")

try:
    user = auth.sign_in_with_email_and_password(email, password)
    print("\n✅ Logged in successfully!")
    print("Token:\n", user["idToken"])
except Exception as e:
    print("❌ Error logging in:", e)
