"""
MarketMind — AES-256 Encryption Utility
Uses Fernet symmetric encryption (AES-128-CBC with HMAC-SHA256) from the cryptography library.
In production, derive the key from a KMS-managed secret, not an env var.
"""
import os
import base64
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

_SECRET = os.getenv("JWT_SECRET", "marketmind-super-secret-key-change-in-production-2026")
_SALT = b"marketmind_salt_2026"

def _get_fernet() -> Fernet:
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=_SALT,
        iterations=480000,
    )
    key = base64.urlsafe_b64encode(kdf.derive(_SECRET.encode()))
    return Fernet(key)

_fernet = _get_fernet()


def encrypt(plaintext: str) -> str:
    """Encrypt a string. Returns base64-encoded ciphertext."""
    if not plaintext:
        return plaintext
    return _fernet.encrypt(plaintext.encode()).decode()


def decrypt(ciphertext: str) -> str:
    """Decrypt a Fernet-encrypted string."""
    if not ciphertext:
        return ciphertext
    return _fernet.decrypt(ciphertext.encode()).decode()
