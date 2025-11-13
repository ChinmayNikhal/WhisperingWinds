"""
Test script for verifying all required environment variables and external integrations.
Run with: python tests/test_environment_var.py
"""

import os
import json
import requests
import firebase_admin
from firebase_admin import credentials
from dotenv import load_dotenv

# Load .env file (if present)
load_dotenv()

print("\n🌿 WhisperingWinds Environment Variable Test")
print("──────────────────────────────────────────────")

# ---------------------------------------------------------------------------
# 1️⃣ Environment Variables Check
# ---------------------------------------------------------------------------

required_vars = [
    "GOOGLE_API_KEY",
    "FIREBASE_API_KEY",
    "FIREBASE_PROJECT_ID",
    "FIREBASE_STORAGE_BUCKET",
    "FIREBASE_MESSAGING_SENDER_ID",
    "FIREBASE_APP_ID",
    "FIREBASE_DATABASE_URL",
    "FIREBASE_SERVICE_ACCOUNT",
    "GOOGLE_APPLICATION_CREDENTIALS",
    "PROJECT_ID",
    "TEST_FIREBASE_EMAIL",
    "TEST_FIREBASE_PASSWORD",
]

missing = []
for var in required_vars:
    val = os.getenv(var)
    if not val or val.strip() == "":
        missing.append(var)
        print(f"❌ {var} is missing or empty")
    else:
        print(f"✅ {var} loaded successfully")

if missing:
    print("\n⚠️ Missing environment variables detected:")
    print(", ".join(missing))
else:
    print("\n✅ All required environment variables are set!")

# ---------------------------------------------------------------------------
# 2️⃣ Firebase Admin SDK Test
# ---------------------------------------------------------------------------

print("\n🔐 Testing Firebase Admin SDK connection...")

try:
    service_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    if not service_path or not os.path.exists(service_path):
        raise FileNotFoundError(f"Service account file not found: {service_path}")

    cred = credentials.Certificate(service_path)
    if not firebase_admin._apps:
        firebase_admin.initialize_app(cred)

    app = firebase_admin.get_app()
    print(f"✅ Firebase Admin initialized successfully: {app.name}")
except Exception as e:
    print(f"❌ Firebase Admin initialization failed: {e}")

# ---------------------------------------------------------------------------
# 3️⃣ Google Air Quality API Key Test
# ---------------------------------------------------------------------------

print("\n🌫️ Testing Google Air Quality API key...")

try:
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
    test_payload = {
        "location": {"latitude": 18.5308, "longitude": 73.8442},
        "universalAqi": True,
        "languageCode": "en"
    }
    url = f"https://airquality.googleapis.com/v1/currentConditions:lookup?key={GOOGLE_API_KEY}"

    response = requests.post(url, json=test_payload)
    if response.status_code == 200:
        print("✅ Google Air Quality API responded successfully!")
        data = response.json()
        sample_aqi = data.get("indexes", [{}])[0].get("aqi", "N/A")
        print(f"   → Sample AQI value: {sample_aqi}")
    else:
        print(f"⚠️ Google API test failed ({response.status_code}): {response.text}")

except Exception as e:
    print(f"❌ Google API test failed: {e}")

# ---------------------------------------------------------------------------
# 4️⃣ Firebase Authentication (Email/Password) Test
# ---------------------------------------------------------------------------

print("\n👤 Testing Firebase Email/Password login...")

try:
    FIREBASE_API_KEY = os.getenv("FIREBASE_API_KEY")
    email = os.getenv("TEST_FIREBASE_EMAIL")
    password = os.getenv("TEST_FIREBASE_PASSWORD")

    auth_url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_API_KEY}"
    payload = {
        "email": email,
        "password": password,
        "returnSecureToken": True
    }

    resp = requests.post(auth_url, json=payload)
    if resp.status_code == 200:
        data = resp.json()
        uid = data.get("localId")
        print(f"✅ Firebase Auth login successful for {email}")
        print(f"   → UID: {uid}")
    else:
        print(f"❌ Firebase Auth login failed ({resp.status_code}): {resp.text}")

except Exception as e:
    print(f"❌ Firebase Auth login test error: {e}")

# ---------------------------------------------------------------------------
# 5️⃣ Final Result
# ---------------------------------------------------------------------------

print("\n──────────────────────────────────────────────")
print("🏁 Environment Test Completed")
print("If all ✅ above, your environment is fully configured and working.\n")
