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
        print(f"✅ Token verified for UID: {uid}")
        return uid
    except auth.InvalidIdTokenError:
        print("❌ Invalid ID token (malformed or expired)")
    except auth.ExpiredIdTokenError:
        print("❌ Token expired")
    except auth.RevokedIdTokenError:
        print("❌ Token revoked")
    except Exception as e:
        print(f"❌ General token verification error: {e}")
    return None
