import firebase_admin
from firebase_admin import auth

def verify_token(id_token: str):
    """
    Verify Firebase ID token from frontend.
    Returns the user's UID if valid.
    """
    try:
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token.get("uid")
        return uid
    except Exception as e:
        print(f"Error verifying token: {e}")
        return None
